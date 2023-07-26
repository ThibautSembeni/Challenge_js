const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const UnauthorizedError = require('./../errors/UnauthorizedError');

function createHash(payload) {
    const hash = crypto.createHash("sha256");
    hash.update(payload);
    return hash.digest("hex");
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new UnauthorizedError({
            token: "Invalid token",
        });
    }
};
module.exports = { createHash, verifyToken };