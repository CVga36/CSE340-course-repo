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

// Get one category by ID
const getCategoryById = async (id) => {
    const query = `
        SELECT *
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

// Get all projects for a category
const getProjectsByCategoryId = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date
        FROM public.project AS p
        JOIN public.project_category AS pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `;

    const result = await db.query(query, [id]);
    return result.rows;
};

// Get all categories for a project
const getCategoriesByProjectId = async (id) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.category AS c
        JOIN public.project_category AS pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [id]);
    return result.rows;
};

export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId
};