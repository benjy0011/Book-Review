// Custom error handler middlware to render error messages
const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging
    console.error(err.stack);

    // Determine the response status code (default to 500 if not set)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // If the request was made to an API, respond with JSON
    if (req.originalUrl.startsWith('/api')) {
        return res.json({
            message: err.message || 'Something went wrong!',
            stack: err.stack,
        });
    }

    // For non-API routes, render the error.ejs page
    res.render('error', {
        message: err.message || 'Something went wrong!',
        status: statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };