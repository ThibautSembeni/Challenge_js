const jwt = require("jsonwebtoken");
const UnauthorizedError = require("./../errors/UnauthorizedError");

const generateVerificationToken = async (user) => {
    const token = jwt.sign(
        { id: user.id, fullName: user.lastname + " " + user.firstname },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );
    return token;
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


module.exports = { generateVerificationToken, getUserFromJWTToken };
