import db from "./db.js";

// Get all organizations from the database
const getAllOrganizations = async () => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM public.organization
        ORDER BY organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Get one organization by ID
const getOrganizationById = async (id) => {
    const query = `
        SELECT *
        FROM public.organization
        WHERE organization_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

// Get projects belonging to an organization
const getProjectsByOrganizationId = async (id) => {
    const query = `
        SELECT *
        FROM public.project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const result = await db.query(query, [id]);
    return result.rows;
};

export {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId
};