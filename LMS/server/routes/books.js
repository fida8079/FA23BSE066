/**
 * Book Routes
 * Maps HTTP methods + URIs to the appropriate controller functions.
 * Follows REST principles: plural nouns, no verbs in URIs.
 */
const express = require("express");
const router = express.Router();
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} = require("../controllers/bookController");

// GET    /books         → Retrieve all books
router.get("/", getAllBooks);

// GET    /books/:id     → Retrieve a specific book
router.get("/:id", getBookById);

// POST   /books         → Create a new book
router.post("/", createBook);

// PUT    /books/:id     → Fully update a book (idempotent)
router.put("/:id", updateBook);

// DELETE /books/:id     → Remove a book (idempotent)
router.delete("/:id", deleteBook);

module.exports = router;
