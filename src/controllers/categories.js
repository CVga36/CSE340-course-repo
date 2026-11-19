import { body, validationResult } from "express-validator";

import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from "../models/categories.js";

import { getProjectById } from "../models/projects.js";

// Validate category name
const categoryValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Category name must be between 3 and 100 characters")
];

// Display all categories
const showCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.render("categories", {
            title: "Service Project Categories",
            categories
        });
    } catch (error) {
        console.error("Error loading categories:", error.message);
        next(error);
    }
};

// Display category details
const showCategoryDetails = async (req, res, next) => {
    try {
        const category = await getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        const projects = await getProjectsByCategoryId(req.params.id);

        res.render("category-details", {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        console.error("Error loading category:", error.message);
        next(error);
    }
};

// Display project category assignment form
const showProjectCategories = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);

        if (!project) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const selectedCategoryIds = assignedCategories.map(
            category => Number(category.category_id)
        );

        res.render("project-categories", {
            title: "Assign Project Categories",
            project,
            categories,
            selectedCategoryIds
        });
    } catch (error) {
        console.error("Error loading project categories:", error.message);
        next(error);
    }
};

// Save project categories
const saveProjectCategories = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const categoryIds = req.body.categoryIds
            ? [].concat(req.body.categoryIds)
            : [];

        await updateCategoryAssignments(projectId, categoryIds);

        req.flash("success", "Project categories updated successfully!");

        res.redirect(303, `/project/${projectId}`);
    } catch (error) {
        console.error("Error saving project categories:", error.message);
        next(error);
    }
};

// Display new category form
const showNewCategory = (req, res) => {
    res.render("new-category", {
        title: "Create New Category",
        errors: [],
        formData: {}
    });
};

// Create category
const addCategory = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("new-category", {
                title: "Create New Category",
                errors: errors.array(),
                formData: req.body
            });
        }

        await createCategory(req.body.name);

        req.flash("success", "Category created successfully!");
        res.redirect(303, "/categories");

    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).render("new-category", {
                title: "Create New Category",
                errors: [{ msg: "Category name already exists." }],
                formData: req.body
            });
        }

        next(error);
    }
};

// Display edit category form
const showEditCategory = async (req, res, next) => {
    try {
        const category = await getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        res.render("edit-category", {
            title: "Edit Category",
            category,
            errors: []
        });

    } catch (error) {
        next(error);
    }
};

// Update category
const saveCategoryChanges = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("edit-category", {
                title: "Edit Category",
                category: {
                    category_id: req.params.id,
                    name: req.body.name
                },
                errors: errors.array()
            });
        }

        const updated = await updateCategory(
            req.params.id,
            req.body.name
        );

        if (!updated) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        req.flash("success", "Category updated successfully!");
        res.redirect(303, "/categories");

    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).render("edit-category", {
                title: "Edit Category",
                category: {
                    category_id: req.params.id,
                    name: req.body.name
                },
                errors: [{ msg: "Category name already exists." }]
            });
        }

        next(error);
    }
};

export {
    showCategories,
    showCategoryDetails,
    showProjectCategories,
    saveProjectCategories,
    categoryValidation,
    showNewCategory,
    addCategory,
    showEditCategory,
    saveCategoryChanges
};