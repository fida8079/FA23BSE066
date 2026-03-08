/**
 * BorrowBookModal.jsx
 * Modal dialog to select a registered member when borrowing an available book.
 * Props:
 *   show        – boolean: display modal
 *   book        – Book object being borrowed
 *   members     – Array of all registered members
 *   onBorrow    – fn(memberId) called when confirmed
 *   onCancel    – fn() called when dismissed
 *   borrowing   – boolean: shows loading state
 */
import { useState, useEffect } from 'react';

const BorrowBookModal = ({ show, book, members, onBorrow, onCancel, borrowing }) => {
    const [selectedMemberId, setSelectedMemberId] = useState('');

    // Reset selection whenever the modal opens
    useEffect(() => {
        if (show) setSelectedMemberId('');
    }, [show]);

    if (!show || !book) return null;

    const handleConfirm = () => {
        if (!selectedMemberId) return;
        onBorrow(parseInt(selectedMemberId));
    };

    return (
        <div
            className="modal show d-block"
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                    {/* Header */}
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">📤 Borrow Book</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onCancel}
                            disabled={borrowing}
                            aria-label="Close"
                        />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <p className="mb-1">
                            <strong>Book:</strong> {book.title}
                        </p>
                        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                            by {book.author}
                        </p>

                        <label className="form-label fw-semibold" htmlFor="borrow-member-select">
                            Select Member
                        </label>
                        {members.length === 0 ? (
                            <div className="alert alert-warning py-2">
                                No registered members found. Please add a member first.
                            </div>
                        ) : (
                            <select
                                id="borrow-member-select"
                                className="form-select"
                                value={selectedMemberId}
                                onChange={(e) => setSelectedMemberId(e.target.value)}
                                disabled={borrowing}
                            >
                                <option value="">— Choose a member —</option>
                                {members.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.fullName} ({m.email})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={borrowing}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleConfirm}
                            disabled={!selectedMemberId || borrowing || members.length === 0}
                        >
                            {borrowing ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Borrowing…
                                </>
                            ) : (
                                '✅ Confirm Borrow'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowBookModal;
