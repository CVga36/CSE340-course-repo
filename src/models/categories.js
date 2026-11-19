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

// Assign a category to a project
const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.project_category (project_id, category_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

    await db.query(query, [projectId, categoryId]);
};

// Update a project's assigned categories
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove previous category assignments
    const deleteQuery = `
        DELETE FROM public.project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // Add the selected categories
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

// Create a new category
const createCategory = async (name) => {
    const query = `
        INSERT INTO public.category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);
    return result.rows[0];
};

// Update an existing category
const updateCategory = async (id, name) => {
    const query = `
        UPDATE public.category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(query, [name, id]);
    return result.rows[0];
};

export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};