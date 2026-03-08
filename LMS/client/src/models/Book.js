/**
 * Book Model (Frontend)
 * Mirrors the backend Book schema. Used for data shaping in the frontend.
 */
const BookModel = {
    defaultValues: () => ({
        title: "",
        author: "",
        isbn: "",
        publishedYear: "",
        status: "available",
    }),

    statusOptions: ["available", "borrowed"],
};

export default BookModel;
