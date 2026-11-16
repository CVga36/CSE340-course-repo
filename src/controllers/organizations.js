import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId
} from "../models/organizations.js";

// Display all organizations
const showOrganizations = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render("organizations", {
            title: "Our Partner Organizations",
            organizations
        });

    } catch (error) {
        console.error("Error loading organizations:", error.message);
        next(error);
    }
};

// Display organization details
const showOrganizationDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const organization = await getOrganizationById(id);

        if (!organization) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        const projects = await getProjectsByOrganizationId(id);

        res.render("organization-details", {
            title: organization.name,
            organization,
            projects
        });

    } catch (error) {
        console.error("Error loading organization:", error.message);
        next(error);
    }
};

export { showOrganizations, showOrganizationDetails };