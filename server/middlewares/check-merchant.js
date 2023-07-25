const UnauthorizedError = require("../errors/UnauthorizedError");
const {getUserFromJWTToken} = require("../utils/user");
const UserService = require("../services/user");
const {Impersonation} = require("../db/models/postgres");
const CredentialService = require("../services/credential");

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        return next(new UnauthorizedError());
    }
    const [type, token] = req.headers.authorization.split(" ");
    if (type !== "Bearer") {
        return next(new UnauthorizedError());
    }
    try {
        const user = getUserFromJWTToken(token);
        if (user.role === 'admin') {
            const impersonationRecord = await Impersonation.findOne({ where: { adminId: user.id } });

            if (impersonationRecord) {
                const userService = UserService()
                req.user = await userService.getMerchantById(impersonationRecord.merchantId);
            } else {
                return next(new UnauthorizedError());
            }
        } else if (user.role === 'merchant') {
            req.user = user;
        } else {
            return next(new UnauthorizedError());
        }
    } catch (err) {
        return next(new UnauthorizedError());
    }
    next();
};
