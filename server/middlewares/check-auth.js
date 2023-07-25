const UnauthorizedError = require("../errors/UnauthorizedError");
const { getUserFromJWTToken } = require("../utils/user");

module.exports = (req, res, next) => {
    if (!req.cookies.token) {
        return next(new UnauthorizedError());
    }

    try {
        req.user = getUserFromJWTToken(req.cookies.token);
    } catch (err) {
        return next(new UnauthorizedError());
    }
    next();
};