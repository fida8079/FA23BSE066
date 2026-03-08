/**
 * MemberBooksModal.jsx
 * Modal that shows all books currently borrowed by a specific member.
 * Allows returning individual books from within the modal.
 *
 * Props:
 *   show         – boolean: display modal
 *   member       – Member object
 *   onClose      – fn() called when closed
 *   onReturn     – fn(bookId) called when a book is returned
 *   returningId  – bookId currently being returned (loading state)
 */
import { useState, useEffect } from 'react';
import { memberService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const MemberBooksModal = ({ show, member, onClose, onReturn, returningId }) => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');

    // Fetch borrowed books whenever the modal opens for a member
    useEffect(() => {
        if (show && member) {
            setLoading(true);
            setFetchError('');
            memberService
                .getMemberBooks(member.id)
                .then((books) => setBorrowedBooks(books))
                .catch(() => setFetchError('Failed to load borrowed books.'))
                .finally(() => setLoading(false));
        } else {
            setBorrowedBooks([]);
        }
    }, [show, member]);

    // Remove a returned book from the local list immediately
    const handleReturn = (bookId) => {
        onReturn(member.id, bookId, () => {
            setBorrowedBooks((prev) => prev.filter((b) => b.id !== bookId));
        });
    };

    if (!show || !member) return null;

    return (
        <div
            className="modal show d-block"
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow">
                    {/* Header */}
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            📚 Borrowed Books — {member.fullName}
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {loading ? (
                            <LoadingSpinner message="Loading borrowed books…" />
                        ) : fetchError ? (
                            <div className="alert alert-danger">{fetchError}</div>
                        ) : borrowedBooks.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <div style={{ fontSize: '3rem' }}>📭</div>
                                <p className="mt-2">
                                    {member.fullName} has no borrowed books at the moment.
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Title</th>
                                            <th>Author</th>
                                            <th>ISBN</th>
                                            <th>Year</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {borrowedBooks.map((book) => (
                                            <tr key={book.id}>
                                                <td className="fw-semibold">{book.title}</td>
                                                <td>{book.author}</td>
                                                <td>
                                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                        {book.isbn}
                                                    </span>
                                                </td>
                                                <td>{book.publishedYear}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleReturn(book.id)}
                                                        disabled={returningId === book.id}
                                                    >
                                                        {returningId === book.id ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-1"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />
                                                                Returning…
                                                            </>
                                                        ) : (
                                                            '↩️ Return'
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <span className="text-muted me-auto" style={{ fontSize: '0.9rem' }}>
                            {borrowedBooks.length} book{borrowedBooks.length !== 1 ? 's' : ''} borrowed
                        </span>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberBooksModal;
