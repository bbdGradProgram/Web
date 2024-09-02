/**
 *
 * @param {Request<>} req
 * @param {Response<ResBody, LocalsObj>} res
 * @param {function()} next
 */
export function authorizationMiddleware(adminRoutes) {
    return (req, res, next) => {
        if (req.path === '/auth/login' || req.method === 'OPTIONS') {
            return next();
        }

        const role = req.headers.role;
        const method = req.method;
        const route = req.path;
        const protectedMethods = adminRoutes[route];

        if (protectedMethods && protectedMethods.includes(method) && role !== 'admin') {
            res.send(403);
        }

        return next();
    };
}
