/**
 * MembersPage.jsx — View: Members Management Page
 * Implements full CRUD for Members plus view borrowed books and return functionality.
 *   - Controller: useMembers (custom hook)
 *   - Components: MemberRow, MemberForm, MemberBooksModal, ConfirmModal, AlertMessage, LoadingSpinner
 */
import { useState } from 'react';
import useMembers from '../controllers/useMembers';
import { memberService } from '../services/api';
import MemberRow from '../components/MemberRow';
import MemberForm from '../components/MemberForm';
import MemberBooksModal from '../components/MemberBooksModal';
import ConfirmModal from '../components/ConfirmModal';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const MembersPage = () => {
    // ── Controller: all state + CRUD operations ──
    const {
        members,
        loading,
        error,
        defaultValues,
        createMember,
        updateMember,
        deleteMember,
        fetchMembers,
    } = useMembers();

    // ── Local UI State ──
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [formValues, setFormValues] = useState(defaultValues());
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formError, setFormError] = useState('');

    // Borrowed books modal state
    const [booksMember, setBooksMember] = useState(null);   // member whose books we view
    const [returningId, setReturningId] = useState(null);   // bookId currently being returned

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
    const handleEditClick = (member) => {
        setEditTarget(member);
        setFormValues({
            fullName: member.fullName,
            email: member.email,
            membershipDate: member.membershipDate,
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
                await updateMember(editTarget.id, formData);
                flashSuccess(`✅ ${formData.fullName}'s record updated successfully.`);
            } else {
                await createMember(formData);
                flashSuccess(`✅ ${formData.fullName} added as a member.`);
            }
            setShowForm(false);
            setEditTarget(null);
        } catch (err) {
            const msg = err?.response?.data?.error || 'Failed to save member. Please try again.';
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Initiate Delete ──
    const handleDeleteClick = (member) => {
        setDeleteTarget(member);
    };

    // ── Confirm Delete ──
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteMember(deleteTarget.id);
            flashSuccess(`🗑️ ${deleteTarget.fullName}'s membership has been removed.`);
        } catch {
            setFormError('Failed to delete member.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    // ── Open borrowed books modal for a member ──
    const handleViewBooks = (member) => {
        setBooksMember(member);
    };

    // ── Return a book from within the modal ──
    // onReturn(memberId, bookId, removeFromList)
    const handleReturnBook = async (memberId, bookId, removeFromList) => {
        setReturningId(bookId);
        try {
            await memberService.returnBook(memberId, bookId);
            removeFromList();
            flashSuccess('✅ Book returned to the library successfully.');
            // Refresh members list so borrowedCount badge updates
            fetchMembers();
        } catch (err) {
            const msg = err?.response?.data?.error || 'Failed to return book.';
            setFormError(msg);
        } finally {
            setReturningId(null);
        }
    };

    return (
        <div className="container py-5">
            {/* ── Page Header ── */}
            <div className="row align-items-center mb-4">
                <div className="col">
                    <h1 className="fw-bold mb-0">👥 Members</h1>
                    <p className="text-muted mt-1">
                        {members.length} registered member{members.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="col-auto">
                    {!showForm && (
                        <button className="btn btn-primary px-4" onClick={handleCreateClick}>
                            ＋ Add Member
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
                        {editTarget ? `✏️ Edit: ${editTarget.fullName}` : '➕ Register New Member'}
                    </div>
                    <div className="card-body">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <MemberForm
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

            {/* ── Members Table ── */}
            {loading ? (
                <LoadingSpinner message="Loading members..." />
            ) : members.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <div style={{ fontSize: '4rem' }}>👤</div>
                    <h4 className="mt-3">No members registered</h4>
                    <p>Click <strong>"Add Member"</strong> to register the first library member.</p>
                </div>
            ) : (
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Full Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Membership Date</th>
                                    <th scope="col">Borrowed Books</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member) => (
                                    <MemberRow
                                        key={member.id}
                                        member={member}
                                        borrowedCount={member.borrowedCount ?? 0}
                                        onEdit={handleEditClick}
                                        onDelete={handleDeleteClick}
                                        onViewBooks={handleViewBooks}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Borrowed Books Modal ── */}
            <MemberBooksModal
                show={!!booksMember}
                member={booksMember}
                onClose={() => setBooksMember(null)}
                onReturn={handleReturnBook}
                returningId={returningId}
            />

            {/* ── Delete Confirmation Modal ── */}
            <ConfirmModal
                show={!!deleteTarget}
                title="Remove Member"
                message={
                    deleteTarget
                        ? `Are you sure you want to remove ${deleteTarget.fullName} (${deleteTarget.email}) from the library? This action cannot be undone.`
                        : ''
                }
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />
        </div>
    );
};

export default MembersPage;
