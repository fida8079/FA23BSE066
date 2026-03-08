/**
 * FormField Component
 * Reusable form field that renders either an <input> or <select>.
 * Reduces code duplication across Create/Edit forms.
 */
const FormField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    options = null, // If provided, renders a <select>
    placeholder = "",
}) => {
    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label fw-semibold">
                {label} {required && <span className="text-danger">*</span>}
            </label>

            {options ? (
                // Render a Bootstrap select element
                <select
                    id={name}
                    name={name}
                    className="form-control"
                    value={value}
                    onChange={onChange}
                    required={required}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                    ))}
                </select>
            ) : (
                // Render a Bootstrap input element
                <input
                    id={name}
                    name={name}
                    type={type}
                    className="form-control"
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

export default FormField;
