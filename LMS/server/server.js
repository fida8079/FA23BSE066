/**
 * LMS Express Server Entry Point
 *
 * Sets up middleware, mounts routes, and starts the HTTP server.
 * Architecture: RESTful API — stateless, resource-based URIs, proper HTTP methods.
 */
const express = require("express");
const cors = require("cors");

const bookRoutes = require("./routes/books");
const memberRoutes = require("./routes/members");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
// Enable Cross-Origin Resource Sharing for the React frontend
app.use(cors({ origin: "http://localhost:5173" }));

// Parse incoming JSON request bodies
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
// Mount book and member routers at their resource paths
app.use("/books", bookRoutes);
app.use("/members", memberRoutes);

// Root health-check endpoint
app.get("/", (req, res) => {
    res.json({ message: "📚 LMS API is running.", version: "1.0.0" });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error." });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ LMS Server running at http://localhost:${PORT}`);
});
