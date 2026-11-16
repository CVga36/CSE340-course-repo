// Handle 404 errors
const showNotFound = (req, res) => {
    res.status(404).render("errors/404", {
        title: "Page Not Found"
    });
};

// Handle 500 errors
const showServerError = (error, req, res, next) => {
    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).render("errors/500", {
        title: "Server Error",
        error: error.message,
        stack: error.stack
    });
};

export { showNotFound, showServerError };