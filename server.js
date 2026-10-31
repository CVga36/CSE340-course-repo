import express from "express";
import { fileURLToPath } from "url";
import path from "path";

// Configure application
const app = express();
const PORT = process.env.PORT || 3000;

// Configure file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Home route
app.get("/", async (req, res) => {
    const title = "Home";
    res.render("home", { title });
});

// Organizations route
app.get("/organizations", async (req, res) => {
    const title = "Our Partner Organizations";
    res.render("organizations", { title });
});

// Projects route
app.get("/projects", async (req, res) => {
    const title = "Service Projects";
    res.render("projects", { title });
});

// Categories route
app.get("/categories", async (req, res) => {
    const title = "Service Project Categories";
    res.render("categories", { title });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});