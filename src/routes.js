import { showNotFound } from "./controllers/errors.js";
import { Router } from "express";

import { showHomePage } from "./controllers/index.js";
import {
    showOrganizations,
    showOrganizationDetails,
    showNewOrganization,
    addOrganization,
    organizationValidation,
    showEditOrganizationForm,
    saveOrganizationChanges
} from "./controllers/organizations.js";

import {
    showProjects,
    showProjectDetails,
    showNewProject,
    addProject,
    projectValidation,
    showEditProjectForm,
    saveProjectChanges
} from "./controllers/projects.js";

import {
    showCategories,
    showCategoryDetails,
    showProjectCategories,
    saveProjectCategories,
    categoryValidation,
    showNewCategory,
    addCategory,
    showEditCategory,
    saveCategoryChanges
} from "./controllers/categories.js";

const router = Router();

// Home
router.get("/", showHomePage);

// Organizations
router.get("/organizations", showOrganizations);
router.get("/organization/:id", showOrganizationDetails);

// Create organization
router.get("/new-organization", showNewOrganization);
router.post("/new-organization", organizationValidation, addOrganization);

// Edit organization form
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post(
    "/edit-organization/:id",
    organizationValidation,
    saveOrganizationChanges
);

// Assign categories to a project
router.get("/project/:id/categories", showProjectCategories);
router.post("/project/:id/categories", saveProjectCategories);

// Projects
router.get("/projects", showProjects);
router.get("/project/:id", showProjectDetails);

// Create new project
router.get("/new-project", showNewProject);
router.post("/new-project", projectValidation, addProject);

// Edit project
router.get("/edit-project/:id", showEditProjectForm);

router.post(
    "/edit-project/:id",
    projectValidation,
    saveProjectChanges
);

// Categories
router.get("/categories", showCategories);
router.get("/category/:id", showCategoryDetails);

// Create category
router.get("/new-category", showNewCategory);
router.post("/new-category", categoryValidation, addCategory);

// Edit category
router.get("/edit-category/:id", showEditCategory);
router.post(
    "/edit-category/:id",
    categoryValidation,
    saveCategoryChanges
);

// Handle unknown routes
router.use(showNotFound);

export default router;