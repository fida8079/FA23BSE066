/**
 * AlertMessage Component
 * Reusable Bootstrap alert for displaying success, error, or info messages.
 */
const AlertMessage = ({ message, type = "danger", onClose }) => {
    if (!message) return null;

    return (
        <div
            className={`alert alert-${type} alert-dismissible fade show`}
            role="alert"
        >
            {message}
            {onClose && (
                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                />
            )}
        </div>
    );
};

export default AlertMessage;
