module.exports = (req, res, next) => {
    req.trustProxy = true;
    next();
}