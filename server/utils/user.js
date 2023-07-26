const jwt = require("jsonwebtoken");
const UnauthorizedError = require("./../errors/UnauthorizedError");

const generateVerificationToken = async (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
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

const generateToken = () => {
    const tokenLength = 64;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }
    return token
};

module.exports = { generateVerificationToken, getUserFromJWTToken, generateToken };
