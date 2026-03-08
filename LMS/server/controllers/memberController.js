/**
 * Member Controller
 * Contains all business logic for Member-related API operations.
 * Keeps logic separate from the route definitions.
 */
const store = require("../data/store");
const Member = require("../models/Member");

// GET /members — Retrieve all members (includes borrowedCount for each)
const getAllMembers = async (req, res) => {
    try {
        const membersWithCounts = store.members.map((m) => ({
            ...m,
            borrowedCount: (store.memberBooks[m.id] || []).length,
        }));
        res.json(membersWithCounts);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve members." });
    }
};

// GET /members/:id — Retrieve a single member by ID
const getMemberById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const member = store.members.find((m) => m.id === id);
        if (!member) return res.status(404).json({ error: "Member not found." });
        res.json(member);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve member." });
    }
};

// POST /members — Create a new member
const createMember = async (req, res) => {
    try {
        const validationError = Member.validate(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        // Ensure email uniqueness
        const emailExists = store.members.some((m) => m.email === req.body.email);
        if (emailExists) return res.status(409).json({ error: "Email already in use." });

        const newMember = new Member({
            id: store.getNextMemberId(),
            ...req.body,
        });
        store.members.push(newMember);
        // Initialize empty borrowed books list for this member
        store.memberBooks[newMember.id] = [];
        res.status(201).json(newMember);
    } catch (err) {
        res.status(500).json({ error: "Failed to create member." });
    }
};

// PUT /members/:id — Update an existing member (full replacement, idempotent)
const updateMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = store.members.findIndex((m) => m.id === id);
        if (index === -1) return res.status(404).json({ error: "Member not found." });

        const validationError = Member.validate(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        // Check email uniqueness — excluding the current member
        const emailExists = store.members.some(
            (m) => m.email === req.body.email && m.id !== id
        );
        if (emailExists) return res.status(409).json({ error: "Email already in use." });

        store.members[index] = new Member({ id, ...req.body });
        res.json(store.members[index]);
    } catch (err) {
        res.status(500).json({ error: "Failed to update member." });
    }
};

// DELETE /members/:id — Remove a member by ID (idempotent)
const deleteMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = store.members.findIndex((m) => m.id === id);
        if (index === -1) return res.status(404).json({ error: "Member not found." });

        store.members.splice(index, 1);
        delete store.memberBooks[id]; // Clean up associated borrowed books
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete member." });
    }
};

/**
 * GET /members/:memberId/books
 * Hierarchical route: get all books borrowed by a specific member.
 */
const getMemberBooks = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const member = store.members.find((m) => m.id === memberId);
        if (!member) return res.status(404).json({ error: "Member not found." });

        const borrowedBookIds = store.memberBooks[memberId] || [];
        const borrowedBooks = store.books.filter((b) => borrowedBookIds.includes(b.id));
        res.json(borrowedBooks);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve member's books." });
    }
};

/**
 * POST /members/:memberId/books/:bookId
 * Borrow a book: mark book as borrowed, link it to the member.
 */
const borrowBook = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const bookId = parseInt(req.params.bookId);

        const member = store.members.find((m) => m.id === memberId);
        if (!member) return res.status(404).json({ error: "Member not found." });

        const book = store.books.find((b) => b.id === bookId);
        if (!book) return res.status(404).json({ error: "Book not found." });

        if (book.status === "borrowed")
            return res.status(409).json({ error: "Book is already borrowed by another member." });

        // Mark book as borrowed
        book.status = "borrowed";
        book.borrowedByMemberId = memberId;

        // Add to member's borrow list
        if (!store.memberBooks[memberId]) store.memberBooks[memberId] = [];
        if (!store.memberBooks[memberId].includes(bookId)) {
            store.memberBooks[memberId].push(bookId);
        }

        res.json({ message: "Book borrowed successfully.", book, member });
    } catch (err) {
        res.status(500).json({ error: "Failed to borrow book." });
    }
};

/**
 * DELETE /members/:memberId/books/:bookId
 * Return a book: mark book as available, unlink from member.
 */
const returnBook = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const bookId = parseInt(req.params.bookId);

        const member = store.members.find((m) => m.id === memberId);
        if (!member) return res.status(404).json({ error: "Member not found." });

        const book = store.books.find((b) => b.id === bookId);
        if (!book) return res.status(404).json({ error: "Book not found." });

        // Mark book as available
        book.status = "available";
        book.borrowedByMemberId = null;

        // Remove from member's borrow list
        if (store.memberBooks[memberId]) {
            store.memberBooks[memberId] = store.memberBooks[memberId].filter(
                (id) => id !== bookId
            );
        }

        res.json({ message: "Book returned successfully.", book, member });
    } catch (err) {
        res.status(500).json({ error: "Failed to return book." });
    }
};

module.exports = {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    getMemberBooks,
    borrowBook,
    returnBook,
};
