/**
 * LoadingSpinner Component
 * Displays a Bootstrap spinner while data is being fetched.
 */
const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary me-3" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <span className="text-muted">{message}</span>
    </div>
);

export default LoadingSpinner;
