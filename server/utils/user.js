const jwt = require("jsonwebtoken");
const UnauthorizedError = require("./../errors/UnauthorizedError");

const generateVerificationToken = async (user) => {
    return jwt.sign(
        {id: user.id,role: user.role},
        process.env.JWT_SECRET,
        {
            expiresIn: "30m",
        }
    );
};

const getUserFromJWTToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new UnauthorizedError({
            token: "Invalid token",
        });
    }
};


module.exports = {generateVerificationToken, getUserFromJWTToken};
