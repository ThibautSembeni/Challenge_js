const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");
const CredentialService = require("../services/credential");
const ImpersonationService = require("../services/impersonation");
const UserService = require("../services/user");

const checkCredentialsValidity = async (req, res, next) => {
    const { publicKey, privateKey } = req.credentials;
    const credentialService = new CredentialService();
    const validKeys = await credentialService.findOne({ client_token: publicKey, client_secret: privateKey })

    if (validKeys && publicKey === validKeys.client_token && privateKey === validKeys.client_secret) {
        req.user = { id: validKeys.user_id };
        await getCustomerData(req, res, next);
        next();
    } else {
        return next(new UnauthorizedError());
    }
};

const checkTokenValidity = async (req, res, next) => {
    const token = req.token;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken.role === "admin" && decodedToken.merchantId) {
            req.user = decodedToken;
            await getImpersonationData(req, res, next);
            next();
        } else if (decodedToken.role === "admin") {
            req.user = decodedToken;
            await getAdminData(req, res, next);
            next();
        } else if (decodedToken.role === "merchant") {
            req.user = decodedToken;
            await getMerchantData(req, res, next);
            next();
        } else if (decodedToken.role === "customer") {
            req.user = decodedToken;
            next();
        } else {
            return next(new UnauthorizedError());
        }
    } catch (error) {
        console.error(error);
        return next(new UnauthorizedError());
    }
};

const getImpersonationData = async (req, res, next) => {
    const impersonationService = new ImpersonationService();
    const impersonationRecord = await impersonationService.findOne({ adminId: req.user.id });
    if (impersonationRecord) {
        req.merchantId = impersonationRecord.merchantId;
        await getMerchantData(req, res, next);
    } else {
        return next(new UnauthorizedError());
    }
}
const getAdminData = async (req, res, next) => {
    const userService = new UserService()
    const currentUser = await userService.findOne({
        id: req.user.id,
        role: 'admin'
    });
    if (currentUser) {
        req.user = currentUser;
    } else {
        return next(new UnauthorizedError());
    }

}
const getMerchantData = async (req, res, next) => {
    const userService = new UserService()
    const currentUser = await userService.findOne({
        id: req.user.id,
        role: 'merchant'
    });
    if (currentUser) {
        req.user = currentUser;
    } else {
        return next(new UnauthorizedError());
    }
}
const getCustomerData = async (req, res, next) => {
    const userService = new UserService()
    const currentUser = await userService.findOne({
        id: req.user.id,
    });

    if (currentUser) {
        req.user = currentUser;
    } else {
        return next(new UnauthorizedError());
    }
}

module.exports = { checkCredentialsValidity, checkTokenValidity };
