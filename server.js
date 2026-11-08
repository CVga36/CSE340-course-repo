import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";
import { getAllCategories } from "./src/models/categories.js";

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
app.get("/", (req, res) => {
    const title = "Home";

    res.render("home", { title });
});

// Organizations route
app.get("/organizations", async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = "Our Partner Organizations";

        res.render("organizations", {
            title,
            organizations
        });

    } catch (error) {
        console.error("Error loading organizations:", error.message);

        res.status(500).send(
            "An error occurred while loading organizations."
        );
    }
});

// Projects route
app.get("/projects", async (req, res) => {
    try {
        const title = "Service Projects";
        const projects = await getAllProjects();

        res.render("projects", {
            title,
            projects
        });

    } catch (error) {
        console.error("Error loading projects:", error.message);
        res.status(500).send("Error loading projects");
    }
});

// Categories route
app.get("/categories", async (req, res) => {
    try {
        const title = "Service Project Categories";

        const categories = await getAllCategories();

        res.render("categories", {
            title,
            categories
        });

    } catch (error) {
        console.error("Error loading categories:", error.message);

        res.status(500).send(
            "An error occurred while loading categories."
        );
    }
});

// Start server
const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(
                `Server running at http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Unable to start server:",
            error.message
        );

        process.exitCode = 1;
    }
};

startServer();