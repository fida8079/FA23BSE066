/**
 * Member Model
 * Defines the structure and factory for Member objects.
 *
 * Fields:
 *   id             - Unique identifier (auto-incremented)
 *   fullName       - Member's full name
 *   email          - Member's email address (unique)
 *   membershipDate - Date the membership was created (ISO string)
 */
class Member {
    constructor({ id, fullName, email, membershipDate }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.membershipDate = membershipDate || new Date().toISOString().split("T")[0];
    }

    /**
     * Validate required fields.
     * Returns an error message string, or null if valid.
     */
    static validate({ fullName, email }) {
        if (!fullName || !email) {
            return "fullName and email are required.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "A valid email address is required.";
        }
        return null;
    }
}

module.exports = Member;
