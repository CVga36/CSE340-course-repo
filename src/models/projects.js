import db from "./db.js";

// Get the next five upcoming projects
const getAllProjects = async () => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.organization_id,
                p.title,
                p.description,
                p.location,
                p.project_date,
                o.name AS organization_name
            FROM public.project AS p
            JOIN public.organization AS o
                ON p.organization_id = o.organization_id
            WHERE p.project_date >= CURRENT_DATE
            ORDER BY p.project_date, p.project_id
            LIMIT 5;
        `;

        const result = await db.query(query);
        return result.rows;

    } catch (error) {
        console.error("Error getting projects:", error.message);
        throw error;
    }
};

// Get one project by ID
const getProjectById = async (id) => {
    const query = `
        SELECT
            p.*,
            o.name AS organization_name
        FROM public.project AS p
        JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

export { getAllProjects, getProjectById };