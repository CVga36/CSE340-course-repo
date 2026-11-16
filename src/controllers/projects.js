import {
    getAllProjects,
    getProjectById
} from "../models/projects.js";

import { getCategoriesByProjectId } from "../models/categories.js";

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

export { showProjects, showProjectDetails };