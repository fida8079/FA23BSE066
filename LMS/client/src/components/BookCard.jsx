/**
 * BookCard Component
 * Reusable Bootstrap 5 card for displaying a single book's details.
 * Accepts onEdit, onDelete, onBorrow, and onReturn callbacks.
 */
const BookCard = ({ book, onEdit, onDelete, onBorrow, onReturn }) => {
    const isAvailable = book.status === 'available';
    const statusBadge = isAvailable ? 'bg-success' : 'bg-warning text-dark';

    return (
        <div className="col-sm-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
                {/* Card header with status badge */}
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-truncate" style={{ maxWidth: '180px' }}>
                        {book.title}
                    </span>
                    <span className={`badge ${statusBadge} ms-2`}>{book.status}</span>
                </div>

                <div className="card-body">
                    <p className="card-text mb-1">
                        <strong>Author:</strong> {book.author}
                    </p>
                    <p className="card-text mb-1">
                        <strong>ISBN:</strong> <span className="text-muted">{book.isbn}</span>
                    </p>
                    <p className="card-text mb-0">
                        <strong>Year:</strong> {book.publishedYear}
                    </p>
                </div>

                {/* Action buttons */}
                <div className="card-footer bg-white border-0 d-flex flex-wrap gap-2">
                    {/* Borrow / Return toggle */}
                    {isAvailable ? (
                        <button
                            className="btn btn-success btn-sm flex-fill"
                            onClick={() => onBorrow(book)}
                            aria-label={`Borrow ${book.title}`}
                        >
                            📤 Borrow
                        </button>
                    ) : (
                        <button
                            className="btn btn-secondary btn-sm flex-fill"
                            onClick={() => onReturn(book)}
                            aria-label={`Return ${book.title}`}
                        >
                            ↩️ Return
                        </button>
                    )}
                    <button
                        className="btn btn-warning btn-sm flex-fill"
                        onClick={() => onEdit(book)}
                        aria-label={`Edit ${book.title}`}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        className="btn btn-danger btn-sm flex-fill"
                        onClick={() => onDelete(book.id)}
                        aria-label={`Delete ${book.title}`}
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
