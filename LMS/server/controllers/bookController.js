/**
 * Book Controller
 * Contains all business logic for handling Book-related API operations.
 * Keeps logic separate from the route definitions.
 */
const store = require("../data/store");
const Book = require("../models/Book");

// GET /books — Retrieve all books
const getAllBooks = async (req, res) => {
    try {
        res.json(store.books);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve books." });
    }
};

// GET /books/:id — Retrieve a single book by ID
const getBookById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const book = store.books.find((b) => b.id === id);
        if (!book) return res.status(404).json({ error: "Book not found." });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve book." });
    }
};

// POST /books — Create a new book
const createBook = async (req, res) => {
    try {
        const validationError = Book.validate(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        const newBook = new Book({
            id: store.getNextBookId(),
            ...req.body,
        });
        store.books.push(newBook);
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ error: "Failed to create book." });
    }
};

// PUT /books/:id — Update an existing book (full replacement, idempotent)
const updateBook = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = store.books.findIndex((b) => b.id === id);
        if (index === -1) return res.status(404).json({ error: "Book not found." });

        const validationError = Book.validate(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        // Preserve id and borrowedByMemberId; replace all other fields
        const existing = store.books[index];
        store.books[index] = new Book({
            id,
            borrowedByMemberId: existing.borrowedByMemberId ?? null,
            ...req.body,
        });
        res.json(store.books[index]);
    } catch (err) {
        res.status(500).json({ error: "Failed to update book." });
    }
};

// DELETE /books/:id — Remove a book by ID (idempotent)
const deleteBook = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = store.books.findIndex((b) => b.id === id);
        if (index === -1) return res.status(404).json({ error: "Book not found." });

        store.books.splice(index, 1);
        res.status(204).send(); // 204 No Content — success, nothing to return
    } catch (err) {
        res.status(500).json({ error: "Failed to delete book." });
    }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
