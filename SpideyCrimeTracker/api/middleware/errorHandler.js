export function errorHandler(error, req, res, next) {
    res.status(error.status || 500);
    res.send({
        error: {
            message: error.message,
        },
    });
    next();
}
