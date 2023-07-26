const credentialsStrategy = (req, res, next) => {
    const { publicKey, privateKey } = req.headers;

    if (publicKey && privateKey) {
        req.authMethod = "credentials";
        req.credentials = { publicKey, privateKey };
    }

    next();
};

module.exports = credentialsStrategy;