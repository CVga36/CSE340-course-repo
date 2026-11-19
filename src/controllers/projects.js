import { body, validationResult } from "express-validator";

import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject
} from "../models/projects.js";

import { getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";

// Project form validation
const projectValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required")
        .isLength({ min: 3, max: 150 })
        .withMessage("Title must be between 3 and 150 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required"),

    body("projectDate")
        .isISO8601()
        .withMessage("Please enter a valid date"),

    body("organizationId")
        .isInt({ min: 1 })
        .withMessage("Please select an organization")
];

// Display upcoming projects
const showProjects = async (req, res, next) => {
    try {
        const projects = await getAllProjects();

        res.render("projects", {
            title: "Service Projects",
            projects
        });
    } catch (error) {
        console.error("Error loading projects:", error.message);
        next(error);
    }
};

// Display project details
const showProjectDetails = async (req, res, next) => {
    try {
        const project = await getProjectById(req.params.id);

        if (!project) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        const categories = await getCategoriesByProjectId(req.params.id);

        res.render("project-details", {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        console.error("Error loading project:", error.message);
        next(error);
    }
};

// Display new project form
const showNewProject = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render("new-project", {
            title: "Create New Service Project",
            organizations,
            errors: [],
            formData: {}
        });

    } catch (error) {
        console.error("Error loading project form:", error.message);
        next(error);
    }
};

// Create a new service project
const addProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        // Check for validation errors
        if (!errors.isEmpty()) {
            const organizations = await getAllOrganizations();

            return res.status(400).render("new-project", {
                title: "Create New Service Project",
                organizations,
                errors: errors.array(),
                formData: req.body
            });
        }

        const {
            title,
            description,
            location,
            projectDate,
            organizationId
        } = req.body;

        const projectId = await createProject(
            title,
            description,
            location,
            projectDate,
            organizationId
        );

        req.flash("success", "Project created successfully!");

        res.redirect(303, `/project/${projectId}`);

    } catch (error) {
        console.error("Error creating project:", error.message);
        next(error);
    }
};

// Display the edit project form
const showEditProjectForm = async (req, res, next) => {
    try {
        const project = await getProjectById(req.params.id);

        if (!project) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        const organizations = await getAllOrganizations();

        res.render("edit-project", {
            title: "Edit Service Project",
            projectDetails: {
                ...project,
                project_date: new Date(project.project_date)
                    .toISOString()
                    .split("T")[0]
            },
            organizations,
            errors: []
        });

    } catch (error) {
        console.error("Error loading edit project form:", error.message);
        next(error);
    }
};

// Save project changes
const saveProjectChanges = async (req, res, next) => {
    try {
        const id = req.params.id;

        const {
            title,
            description,
            location,
            projectDate,
            organizationId
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const organizations = await getAllOrganizations();

            return res.status(400).render("edit-project", {
                title: "Edit Service Project",
                projectDetails: {
                    project_id: id,
                    title,
                    description,
                    location,
                    project_date: projectDate,
                    organization_id: organizationId
                },
                organizations,
                errors: errors.array()
            });
        }

        const updated = await updateProject(
            id,
            title,
            description,
            location,
            projectDate,
            organizationId
        );

        if (!updated) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        req.flash("success", "Project updated successfully!");

        res.redirect(303, `/project/${id}`);

    } catch (error) {
        console.error("Error updating project:", error.message);
        next(error);
    }
};

export {
    showProjects,
    showProjectDetails,
    showNewProject,
    addProject,
    projectValidation,
    showEditProjectForm,
    saveProjectChanges
};