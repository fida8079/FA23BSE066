/**
 * MemberRow.jsx — Table Row Component for a Single Member
 * Reusable row for the Members list table.
 * Props: member, onEdit, onDelete, onViewBooks, borrowedCount
 */
const MemberRow = ({ member, onEdit, onDelete, onViewBooks, borrowedCount }) => {
    return (
        <tr>
            <td className="align-middle">{member.id}</td>
            <td className="align-middle fw-semibold">{member.fullName}</td>
            <td className="align-middle">
                <a href={`mailto:${member.email}`} className="text-decoration-none">
                    {member.email}
                </a>
            </td>
            <td className="align-middle">{member.membershipDate}</td>
            <td className="align-middle">
                {/* Borrowed books badge */}
                <button
                    className={`btn btn-sm me-2 ${borrowedCount > 0 ? 'btn-warning' : 'btn-outline-secondary'}`}
                    onClick={() => onViewBooks(member)}
                    title="View borrowed books"
                >
                    📚 {borrowedCount} Borrowed
                </button>
            </td>
            <td className="align-middle">
                <div className="d-flex gap-2">
                    {/* Edit button */}
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={() => onEdit(member)}
                        aria-label={`Edit ${member.fullName}`}
                    >
                        ✏️ Edit
                    </button>
                    {/* Delete button */}
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(member)}
                        aria-label={`Delete ${member.fullName}`}
                    >
                        🗑️ Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default MemberRow;
