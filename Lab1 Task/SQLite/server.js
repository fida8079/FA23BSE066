const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database setup
const db = new sqlite3.Database("database.db");

// Create table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT
    )
`);

// Serve the form explicitly (optional since express.static serves it)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle form submission
app.post("/save", (req, res) => {
    const { name, phone } = req.body;
    db.run(
        "INSERT INTO users (name, phone) VALUES (?, ?)",
        [name, phone],
        (err) => {
            if (err) {
                return res.status(500).send("Error saving data");
            }
            res.send("Saved Successfully ✅");
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
