const UnauthorizedError = require('./../errors/UnauthorizedError');
const { verifyToken } = require("../utils/security");
module.exports = (req, res, next) => {

    if (process.env.NODE_ENV !== 'production') return next()
    const forwardedBy = req.headers['x-forwarded-by'];

    if (!forwardedBy) {
        return next(new UnauthorizedError());
    }

    try {
        const { ip } = verifyToken(req.query.token);
        if (ip !== forwardedBy) return next(new UnauthorizedError());
    } catch (err) {
        return next(new UnauthorizedError());
    }
    next();
};