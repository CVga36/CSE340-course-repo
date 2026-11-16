import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from "../models/categories.js";

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

export { showCategories, showCategoryDetails };