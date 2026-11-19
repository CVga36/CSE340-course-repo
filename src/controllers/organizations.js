import { body, validationResult } from "express-validator";

import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
} from "../models/organizations.js";

// Organization form validation
const organizationValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Organization name is required")
        .isLength({ min: 3, max: 150 })
        .withMessage("Name must be between 3 and 150 characters")
        .escape(),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters")
        .escape(),

    body("contactEmail")
        .trim()
        .notEmpty()
        .withMessage("Contact email is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail()
];

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

// Display the new organization form
const showNewOrganization = (req, res) => {
    res.render("new-organization", {
        title: "Create New Organization",
        errors: [],
        formData: {}
    });
};

// Process the organization form
const addOrganization = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).render("new-organization", {
                title: "Create New Organization",
                errors: errors.array(),
                formData: req.body
            });
        }

        const { name, description, contactEmail } = req.body;

        await createOrganization(
            name,
            description,
            contactEmail
        );

        // Show success message
        req.flash("success", "Organization created successfully!");

        res.redirect(303, "/organizations");

    } catch (error) {
        console.error("Error creating organization:", error.message);
        next(error);
    }
};

// Display the edit organization form
const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationDetails = await getOrganizationById(req.params.id);

        if (!organizationDetails) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        res.render("edit-organization", {
            title: "Edit Organization",
            organizationDetails
        });

    } catch (error) {
        console.error("Error loading edit form:", error.message);
        next(error);
    }
};

// Update an existing organization
const saveOrganizationChanges = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, description, contactEmail, logoFilename } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("edit-organization", {
                title: "Edit Organization",
                organizationDetails: {
                    organization_id: id,
                    name,
                    description,
                    contact_email: contactEmail,
                    logo_filename: logoFilename
                },
                errors: errors.array()
            });
        }

        const updated = await updateOrganization(
            id,
            name,
            description,
            contactEmail,
            logoFilename
        );

        if (!updated) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        req.flash("success", "Organization updated successfully!");

        res.redirect(303, "/organizations");

    } catch (error) {
        console.error("Error updating organization:", error.message);
        next(error);
    }
};

export {
    showOrganizations,
    showOrganizationDetails,
    showNewOrganization,
    addOrganization,
    organizationValidation,
    showEditOrganizationForm,
    saveOrganizationChanges
};