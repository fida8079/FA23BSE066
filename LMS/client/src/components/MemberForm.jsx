/**
 * MemberForm.jsx — Reusable Form Component for Create / Edit Member
 * Receives initialValues and onSubmit callback.
 */
import { useState, useEffect } from 'react';
import FormField from './FormField';

const MemberForm = ({ initialValues, onSubmit, onCancel, submitting }) => {
    const [form, setForm] = useState(initialValues);

    // Sync form when editing a different member
    useEffect(() => {
        setForm(initialValues);
    }, [initialValues]);

    // Generic change handler
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
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="e.g. Alice Johnson"
            />
            <FormField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="e.g. alice@example.com"
            />
            <FormField
                label="Membership Date"
                name="membershipDate"
                type="date"
                value={form.membershipDate}
                onChange={handleChange}
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
                        '💾 Save Member'
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

export default MemberForm;
