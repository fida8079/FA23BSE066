/**
 * ConfirmModal.jsx — Bootstrap 5 Confirmation Modal
 * Used to confirm destructive actions like deletion.
 * Props:
 *   show      - boolean, controls visibility
 *   title     - modal header text
 *   message   - confirmation message body
 *   onConfirm - callback when user clicks Confirm
 *   onCancel  - callback when user cancels
 *   loading   - boolean, disables buttons while processing
 */
const ConfirmModal = ({ show, title, message, onConfirm, onCancel, loading }) => {
    if (!show) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={onCancel}
                style={{ zIndex: 1040 }}
            />

            {/* Modal Dialog */}
            <div
                className="modal fade show d-block"
                role="dialog"
                aria-modal="true"
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        {/* Header */}
                        <div className="modal-header bg-danger text-white border-0">
                            <h5 className="modal-title fw-bold">⚠️ {title}</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onCancel}
                                disabled={loading}
                                aria-label="Close"
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body py-4">
                            <p className="mb-0 fs-6">{message}</p>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                                        Deleting...
                                    </>
                                ) : (
                                    '🗑️ Yes, Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;
