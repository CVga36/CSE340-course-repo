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


// Create a new organization
const createOrganization = async (name, description, contactEmail) => {
    const query = `
        INSERT INTO public.organization
            (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;

    const result = await db.query(query, [
        name,
        description,
        contactEmail,
        "cse340-service-network.png"
    ]);

    return result.rows[0];
};

// Update an existing organization
const updateOrganization = async (id, name, description, contactEmail, logoFilename) => {
    const query = `
        UPDATE public.organization
        SET
            name = $1,
            description = $2,
            contact_email = $3,
            logo_filename = $4
        WHERE organization_id = $5
        RETURNING organization_id;
    `;

    const result = await db.query(query, [
        name,
        description,
        contactEmail,
        logoFilename,
        id
    ]);

    return result.rows[0];
};


export {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
};