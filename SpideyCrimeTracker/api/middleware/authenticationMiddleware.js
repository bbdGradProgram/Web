import jwt from 'jsonwebtoken';

/**
 *
 * @param {Request<>} req
 * @param {Response<ResBody, LocalsObj>} res
 * @param {function()} next
 */
export function authenticationMiddleware(req, res, next) {
    const path = req.path;
    if (req.path === '/auth/login' || req.method === 'OPTIONS') {
        return next();
    }

    const bearerToken = req.get('Authorization');

    if (!bearerToken) {
        return res.sendStatus(401);
    }

    const [tokenType, token] = bearerToken.split(' ');
    if (!token || tokenType !== 'Bearer') {
        return res.sendStatus(401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    try {
        const decoded = jwt.verify(token, jwtSecret, {issuer: 'spidey-crime-tracker'});
        req.headers.role = decoded.role;
        req.headers.username = decoded.username;
    } catch (err) {
        return res.status(401).send({'Error': 'Token invalid. Please login again'});
    }

    return next();
}
