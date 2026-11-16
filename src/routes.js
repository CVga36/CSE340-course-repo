import { showNotFound } from "./controllers/errors.js";
import { Router } from "express";

import { showHomePage } from "./controllers/index.js";
import {
    showOrganizations,
    showOrganizationDetails
} from "./controllers/organizations.js";
import {
    showProjects,
    showProjectDetails
} from "./controllers/projects.js";
import {
    showCategories,
    showCategoryDetails
} from "./controllers/categories.js";
const router = Router();

// Home
router.get("/", showHomePage);

// Organizations
router.get("/organizations", showOrganizations);
router.get("/organization/:id", showOrganizationDetails);

// Projects
router.get("/projects", showProjects);
router.get("/project/:id", showProjectDetails);
// Categories
router.get("/categories", showCategories);
router.get("/category/:id", showCategoryDetails);


// Handle unknown routes
router.use(showNotFound);

export default router;