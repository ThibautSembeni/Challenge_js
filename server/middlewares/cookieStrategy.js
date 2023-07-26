const cookieStrategy = (req, res, next) => {
    const { token } = req.cookies;

    if (token) {
        req.authMethod = "cookie";
        req.token = token;
    }

    next();
};

module.exports = cookieStrategy;