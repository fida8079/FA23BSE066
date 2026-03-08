/**
 * BooksPage.jsx — View: Books Management Page
 * Implements full CRUD for Books plus Borrow / Return functionality.
 *   - Controller: useBooks (custom hook)
 *   - Components: BookCard, BookForm, BorrowBookModal, ConfirmModal, AlertMessage, LoadingSpinner
 */
import { useState } from 'react';
import useBooks from '../controllers/useBooks';
import useMembers from '../controllers/useMembers';
import BookCard from '../components/BookCard';
import BookForm from '../components/BookForm';
import BorrowBookModal from '../components/BorrowBookModal';
import ConfirmModal from '../components/ConfirmModal';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const BooksPage = () => {
    // ── Controllers ──
    const {
        books,
        loading,
        error,
        defaultValues,
        createBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
    } = useBooks();

    const { members } = useMembers();

    // ── Local UI State ──
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [formValues, setFormValues] = useState(defaultValues());
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formError, setFormError] = useState('');

    // Borrow modal state
    const [borrowTarget, setBorrowTarget] = useState(null);   // book to borrow
    const [borrowing, setBorrowing] = useState(false);

    // Return confirmation state
    const [returnTarget, setReturnTarget] = useState(null);   // book to return
    const [returning, setReturning] = useState(false);

    // Flash a success message for 3 seconds
    const flashSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    // ── Open Create Form ──
    const handleCreateClick = () => {
        setEditTarget(null);
        setFormValues(defaultValues());
        setFormError('');
        setShowForm(true);
    };

    // ── Open Edit Form ──
    const handleEditClick = (book) => {
        setEditTarget(book);
        setFormValues({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publishedYear: book.publishedYear,
            status: book.status,
        });
        setFormError('');
        setShowForm(true);
    };

    // ── Cancel Form ──
    const handleCancel = () => {
        setShowForm(false);
        setEditTarget(null);
        setFormError('');
    };

    // ── Submit Form (Create or Update) ──
    const handleFormSubmit = async (formData) => {
        setSubmitting(true);
        setFormError('');
        try {
            if (editTarget) {
                await updateBook(editTarget.id, formData);
                flashSuccess(`✅ "${formData.title}" updated successfully.`);
            } else {
                await createBook(formData);
                flashSuccess(`✅ "${formData.title}" added to the library.`);
            }
            setShowForm(false);
            setEditTarget(null);
        } catch (err) {
            const msg = err?.response?.data?.error || 'Failed to save book. Please try again.';
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Initiate Delete ──
    const handleDeleteClick = (bookId) => {
        const book = books.find((b) => b.id === bookId);
        setDeleteTarget(book);
    };

    // ── Confirm Delete ──
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteBook(deleteTarget.id);
            flashSuccess(`🗑️ "${deleteTarget.title}" has been removed.`);
        } catch {
            setFormError('Failed to delete book.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    // ── Open Borrow Modal ──
    const handleBorrowClick = (book) => {
        setBorrowTarget(book);
    };

    // ── Confirm Borrow ──
    const handleBorrowConfirm = async (memberId) => {
        setBorrowing(true);
        try {
            await borrowBook(memberId, borrowTarget.id);
            const member = members.find((m) => m.id === memberId);
            flashSuccess(
                `✅ "${borrowTarget.title}" borrowed by ${member ? member.fullName : 'member'}.`
            );
            setBorrowTarget(null);
        } catch (err) {
            const msg = err?.response?.data?.error || 'Failed to borrow book.';
            setFormError(msg);
            setBorrowTarget(null);
        } finally {
            setBorrowing(false);
        }
    };

    // ── Open Return Confirmation ──
    const handleReturnClick = (book) => {
        setReturnTarget(book);
    };

    // ── Confirm Return ──
    const handleReturnConfirm = async () => {
        if (!returnTarget) return;
        setReturning(true);
        try {
            await returnBook(returnTarget.borrowedByMemberId, returnTarget.id);
            flashSuccess(`✅ "${returnTarget.title}" has been returned to the library.`);
        } catch (err) {
            const msg = err?.response?.data?.error || 'Failed to return book.';
            setFormError(msg);
        } finally {
            setReturning(false);
            setReturnTarget(null);
        }
    };

    return (
        <div className="container py-5">
            {/* ── Page Header ── */}
            <div className="row align-items-center mb-4">
                <div className="col">
                    <h1 className="fw-bold mb-0">📖 Books</h1>
                    <p className="text-muted mt-1">
                        {books.length} book{books.length !== 1 ? 's' : ''} in the library
                        {books.filter((b) => b.status === 'available').length > 0 && (
                            <span className="ms-2 badge bg-success">
                                {books.filter((b) => b.status === 'available').length} available
                            </span>
                        )}
                        {books.filter((b) => b.status === 'borrowed').length > 0 && (
                            <span className="ms-2 badge bg-warning text-dark">
                                {books.filter((b) => b.status === 'borrowed').length} borrowed
                            </span>
                        )}
                    </p>
                </div>
                <div className="col-auto">
                    {!showForm && (
                        <button className="btn btn-primary px-4" onClick={handleCreateClick}>
                            ＋ Add Book
                        </button>
                    )}
                </div>
            </div>

            {/* ── Global Alerts ── */}
            <AlertMessage message={successMsg} type="success" onClose={() => setSuccessMsg('')} />
            <AlertMessage message={error} type="danger" />
            <AlertMessage message={formError} type="danger" onClose={() => setFormError('')} />

            {/* ── Create / Edit Form Panel ── */}
            {showForm && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-primary text-white fw-semibold">
                        {editTarget ? `✏️ Edit: ${editTarget.title}` : '➕ Add New Book'}
                    </div>
                    <div className="card-body">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <BookForm
                                    initialValues={formValues}
                                    onSubmit={handleFormSubmit}
                                    onCancel={handleCancel}
                                    submitting={submitting}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Books Grid ── */}
            {loading ? (
                <LoadingSpinner message="Loading books..." />
            ) : books.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <div style={{ fontSize: '4rem' }}>📭</div>
                    <h4 className="mt-3">No books found</h4>
                    <p>Click <strong>"Add Book"</strong> to add the first book to the library.</p>
                </div>
            ) : (
                <div className="row">
                    {books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            onBorrow={handleBorrowClick}
                            onReturn={handleReturnClick}
                        />
                    ))}
                </div>
            )}

            {/* ── Borrow Book Modal ── */}
            <BorrowBookModal
                show={!!borrowTarget}
                book={borrowTarget}
                members={members}
                onBorrow={handleBorrowConfirm}
                onCancel={() => setBorrowTarget(null)}
                borrowing={borrowing}
            />

            {/* ── Return Confirmation Modal ── */}
            <ConfirmModal
                show={!!returnTarget}
                title="Return Book"
                message={
                    returnTarget
                        ? `Are you sure you want to return "${returnTarget.title}"? It will be marked as available.`
                        : ''
                }
                onConfirm={handleReturnConfirm}
                onCancel={() => setReturnTarget(null)}
                loading={returning}
            />

            {/* ── Delete Confirmation Modal ── */}
            <ConfirmModal
                show={!!deleteTarget}
                title="Delete Book"
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.title}" by ${deleteTarget.author}? This action cannot be undone.`
                        : ''
                }
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />
        </div>
    );
};

export default BooksPage;
