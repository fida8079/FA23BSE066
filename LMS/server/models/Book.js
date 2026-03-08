/**
 * Book Model
 * Defines the structure and factory for Book objects.
 *
 * Fields:
 *   id          - Unique identifier (auto-incremented)
 *   title       - Book title
 *   author      - Book author
 *   isbn        - International Standard Book Number
 *   publishedYear - Year the book was published
 *   status      - 'available' | 'borrowed'
 */
class Book {
    constructor({ id, title, author, isbn, publishedYear, status = "available", borrowedByMemberId = null }) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publishedYear = Number(publishedYear);
        this.status = status;
        this.borrowedByMemberId = borrowedByMemberId;
    }

    /**
     * Validate required fields.
     * Returns an error message string, or null if valid.
     */
    static validate({ title, author, isbn, publishedYear }) {
        if (!title || !author || !isbn || !publishedYear) {
            return "title, author, isbn, and publishedYear are required.";
        }
        return null;
    }
}

module.exports = Book;
