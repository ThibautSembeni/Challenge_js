const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");
const {getUserFromJWTToken} = require("../utils/user");

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return next(new UnauthorizedError());
    }
    const [type, token] = req.headers.authorization.split(" ");
    if (type !== "Bearer") {
        return next(new UnauthorizedError());
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log(user.role)
        if (user.role !== 'admin'){
            return next(new UnauthorizedError());
        }
        req.user = user
    } catch (err) {
        return next(new UnauthorizedError());
    }
    next();
};