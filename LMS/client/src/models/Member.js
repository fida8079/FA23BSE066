/**
 * Member Model (Frontend)
 * Mirrors the backend Member schema. Used for data shaping in the frontend.
 */
const MemberModel = {
    defaultValues: () => ({
        fullName: "",
        email: "",
        membershipDate: new Date().toISOString().split("T")[0],
    }),
};

export default MemberModel;
