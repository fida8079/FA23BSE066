/**
 * useBooks — Custom hook acting as the Book Controller.
 * Manages all Book-related state and operations.
 * Keeps business logic out of the View components.
 */
import { useState, useEffect, useCallback } from "react";
import { bookService, memberService } from "../services/api";
import BookModel from "../models/Book";

const useBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all books from the API
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookService.getAll();
            setBooks(data);
        } catch (err) {
            setError("Failed to load books. Is the server running?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Create a new book
    const createBook = async (formData) => {
        const newBook = await bookService.create(formData);
        setBooks((prev) => [...prev, newBook]);
        return newBook;
    };

    // Update an existing book
    const updateBook = async (id, formData) => {
        const updated = await bookService.update(id, formData);
        setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
        return updated;
    };

    // Delete a book
    const deleteBook = async (id) => {
        await bookService.delete(id);
        setBooks((prev) => prev.filter((b) => b.id !== id));
    };

    // Borrow a book (assigns it to a member)
    const borrowBook = async (memberId, bookId) => {
        const result = await memberService.borrowBook(memberId, bookId);
        setBooks((prev) =>
            prev.map((b) =>
                b.id === bookId
                    ? { ...b, status: "borrowed", borrowedByMemberId: memberId }
                    : b
            )
        );
        return result;
    };

    // Return a borrowed book
    const returnBook = async (memberId, bookId) => {
        const result = await memberService.returnBook(memberId, bookId);
        setBooks((prev) =>
            prev.map((b) =>
                b.id === bookId
                    ? { ...b, status: "available", borrowedByMemberId: null }
                    : b
            )
        );
        return result;
    };

    return {
        books,
        loading,
        error,
        defaultValues: BookModel.defaultValues,
        statusOptions: BookModel.statusOptions,
        fetchBooks,
        createBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
    };
};

export default useBooks;
