const {Credential} = require("../db/models/postgres");


module.exports = function credentialController(CredentialService) {
    return {
        verify: async (req, res, next) => {
            try {
                const { client_token, client_secret } = req.body;
                const credentials = await CredentialService.findOne({ client_token, client_secret });
                if (credentials) {
                    return res.status(200).json(credentials);
                } else {
                    return res.status(404).json({ error: 'Token not found' });
                }
            } catch (error) {
                if (error.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    console.error(error);
                    next(error);
                }
            }
        },
        regenerate: async (req, res, next) => {
            const user = req.user
            const deleteCredentials = await CredentialService.delete({ user_id:user.id });
            const credentials = await CredentialService.create({ user_id:user.id });
            res.json(credentials)
        }
    };
};