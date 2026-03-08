/**
 * Member Routes
 * Maps HTTP methods + URIs to the appropriate controller functions.
 * Includes the hierarchical route: GET /members/:memberId/books
 */
const express = require("express");
const router = express.Router();
const {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    getMemberBooks,
    borrowBook,
    returnBook,
} = require("../controllers/memberController");

// GET    /members               → Retrieve all members
router.get("/", getAllMembers);

// GET    /members/:memberId/books → Hierarchical: books borrowed by a member
router.get("/:memberId/books", getMemberBooks);

// POST   /members/:memberId/books/:bookId → Borrow a book
router.post("/:memberId/books/:bookId", borrowBook);

// DELETE /members/:memberId/books/:bookId → Return a book
router.delete("/:memberId/books/:bookId", returnBook);

// GET    /members/:id           → Retrieve a specific member
router.get("/:id", getMemberById);

// POST   /members               → Create a new member
router.post("/", createMember);

// PUT    /members/:id           → Fully update a member (idempotent)
router.put("/:id", updateMember);

// DELETE /members/:id           → Remove a member (idempotent)
router.delete("/:id", deleteMember);

module.exports = router;
