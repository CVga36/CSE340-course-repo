import db from "./db.js";

// Get all service project categories
const getAllCategories = async () => {
    try {
        const query = `
            SELECT
                category_id,
                name
            FROM public.category
            ORDER BY category_id;
        `;

        const result = await db.query(query);

        return result.rows;

    } catch (error) {
        console.error("Error getting categories:", error.message);
        throw error;
    }
};

export { getAllCategories };