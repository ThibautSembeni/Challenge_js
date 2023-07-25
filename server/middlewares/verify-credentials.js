const { getUserFromJWTToken } = require("../utils/user");
const CredentialService = require("../services/credential")
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        return next(new UnauthorizedError());
    }

    const [type, token] = req.cookies.token.split(" ");
    const { client_token, client_secret } = req.headers;
    const user = getUserFromJWTToken(token);

    req.user = user

    if (user.role === 'merchant' && req.headers.hasOwnProperty('client_token') && req.headers.hasOwnProperty('client_secret')) {
        const credentialService = CredentialService()
        const credentials = await credentialService.findOne({ client_token, client_secret })

        if (credentials?.user_id === user.id) {
            return next()
        }

        return next(new UnauthorizedError());
    } else if (user?.role === 'merchant') {
        return res.status(401).json({ error: 'Invalid credentials' });
    } else {
        return next()
    }
}