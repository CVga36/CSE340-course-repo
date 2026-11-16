import { showServerError } from "./src/controllers/errors.js";
import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

import { testConnection } from "./src/models/db.js";
import routes from "./src/routes.js";

// Configure application
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Configure file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Log requests in development mode
app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Make NODE_ENV available to EJS
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Application routes
app.use("/", routes);

// Handle server errors
app.use(showServerError);

// Start server
const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exitCode = 1;
    }
};

startServer();