import { Pool } from "pg";

// Check database configuration
const connectionString = process.env.DB_URL;

if (!connectionString) {
    throw new Error("DB_URL environment variable is missing");
}

// Configure database connection
const db = new Pool({
    connectionString: connectionString,
    ssl: process.env.RENDER === "true" ? false : true,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000
});

// Test database connection
const testConnection = async () => {
    try {
        const result = await db.query(
            "SELECT NOW() AS current_time"
        );

        console.log(
            "Database connection successful:",
            result.rows[0].current_time
        );

        return true;

    } catch (error) {
        console.error(
            "Database connection failed:",
            error.message
        );

        throw error;
    }
};

export { db as default, testConnection };