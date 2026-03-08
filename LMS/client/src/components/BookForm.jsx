/**
 * BookForm.jsx — Reusable Form Component for Create / Edit Book
 * Receives initialValues and onSubmit callback.
 * Uses the FormField component to avoid repeated input markup.
 */
import { useState, useEffect } from 'react';
import FormField from './FormField';

// Status options for the book select field
const STATUS_OPTIONS = ['available', 'borrowed'];

const BookForm = ({ initialValues, onSubmit, onCancel, submitting }) => {
    const [form, setForm] = useState(initialValues);

    // Sync form when editing a different book
    useEffect(() => {
        setForm(initialValues);
    }, [initialValues]);

    // Generic change handler — works for both inputs and selects
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <FormField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Clean Code"
            />
            <FormField
                label="Author"
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                placeholder="e.g. Robert C. Martin"
            />
            <FormField
                label="ISBN"
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                required
                placeholder="e.g. 978-0132350884"
            />
            <FormField
                label="Published Year"
                name="publishedYear"
                type="number"
                value={form.publishedYear}
                onChange={handleChange}
                required
                placeholder="e.g. 2008"
            />
            <FormField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={STATUS_OPTIONS}
                required
            />

            <div className="d-flex gap-2 mt-4">
                <button
                    type="submit"
                    className="btn btn-primary flex-fill"
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            Saving...
                        </>
                    ) : (
                        '💾 Save Book'
                    )}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default BookForm;
