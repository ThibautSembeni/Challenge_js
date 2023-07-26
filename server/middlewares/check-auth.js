const credentialsStrategy = require("./credentialsStrategy");
const UnauthorizedError = require("../errors/UnauthorizedError");
const cookieStrategy = require("./cookieStrategy");
const { checkCredentialsValidity, checkTokenValidity } = require("../utils/authUtils");

const authenticationVisitor = (req, res, next) => {
    credentialsStrategy(req, res, () => {
        if (req.authMethod === "credentials") {
            return checkCredentialsValidity(req, res, next);
        }

        cookieStrategy(req, res, () => {
            if (req.authMethod === "cookie") {
                return checkTokenValidity(req, res, next);
            }

            return next(new UnauthorizedError());
        });
    });
};

module.exports = authenticationVisitor;