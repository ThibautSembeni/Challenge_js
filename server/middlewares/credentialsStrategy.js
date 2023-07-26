const credentialsStrategy = (req, res, next) => {
    const headers = req.headers;

    if (headers["x-public-key"] && headers["x-secret-key"]) {
        req.authMethod = "credentials";
        req.credentials = { publicKey: headers["x-public-key"], privateKey: headers["x-secret-key"] };
    }

    next();
};

module.exports = credentialsStrategy;