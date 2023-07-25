const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");
const { getUserFromJWTToken } = require("../utils/user");

module.exports = (req, res, next) => {
    if (!req.cookies.token) {
        return next(new UnauthorizedError());
    }

    try {
        const user = getUserFromJWTToken(token);
        if (user.role !== 'admin') {
            return next(new UnauthorizedError());
        }
        req.user = user
    } catch (err) {
        return next(new UnauthorizedError());
    }
    next();
};