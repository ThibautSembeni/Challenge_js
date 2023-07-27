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
        const currentUser = await getCustomerData(validKeys.user_id);
        if (!currentUser) {
            return next(new UnauthorizedError());
        }
        req.user = currentUser;
        return next();
    } else {
        return next(new UnauthorizedError());
    }
};

const checkTokenValidity = async (req, res, next) => {
    const token = req.token;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken)
        if (decodedToken.role === "admin") {
            const isImpersonna = await isImpersonnation(decodedToken.id);
            if (isImpersonna) {
                req.merchantId = isImpersonna
                req.userId = decodedToken.id
                const currentUser = await getMerchantData(isImpersonna);
                if (!currentUser) {
                    throw new Error(`Merchant data not found when is impersonation`);
                }
                req.user = currentUser
                return next();
            } else {
                const currentUser = await getAdminData(decodedToken.id);
                if (!currentUser) {
                    throw new Error(`cannot find admin data`);
                }
                req.user = currentUser;
                return next();
            }
        } else if (decodedToken.role === "merchant") {
            const currentUser = await getMerchantData(decodedToken.id);
            if (!currentUser) {
                throw new Error(`cannot find merchant data`);
            }
            req.user = currentUser
            return next();
        } else if (decodedToken.role === "customer") {
            const currentUser = await getCustomerData(decodedToken.id);
            if (!currentUser) {
                throw new Error(`cannot find user`);
            }
            req.user = currentUser;
            return next();
        } else {
            throw new Error(`Invalid user`);
        }
    } catch (error) {
        console.error(error);
        return next(new UnauthorizedError());
    }
};

const isImpersonnation = async (id) => {
    const impersonationService = new ImpersonationService();
    const impersonationRecord = await impersonationService.findOne({ adminId: id });
    if (impersonationRecord) {
        return impersonationRecord.merchantId;
    } else {
        return null;
    }
}

const getAdminData = async (id) => {
    const userService = new UserService()
    const currentUser = await userService.findOne({
        id: id,
        role: 'admin'
    });
    if (currentUser) {
        return currentUser;
    } else {
        return null
    }

}

const getMerchantData = async (id) => {
    const userService = new UserService()
    const currentUser = await userService.findOne({
        id: id,
        role: 'merchant'
    });
    if (currentUser) {
        return currentUser;
    } else {
        return null;
    }
}
const getCustomerData = async (id) => {
    const userService = new UserService()
    const currentUser = await userService.findOne({
        id: id,
    });

    if (currentUser) {
        return currentUser;
    } else {
        return null
    }
}

module.exports = { checkCredentialsValidity, checkTokenValidity };
