const { getUserFromJWTToken, generateVerificationToken, checkTokenMiddleware } = require("../utils/user");
const { User, Credential } = require("../db");

module.exports = function SecurityController(UserService) {
    return {
        login: async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const user = await UserService.login(email, password);
                const token = generateVerificationToken(user);
                res.cookie('token', token, { httpOnly: true });
                res.json({ token });
            } catch (err) {
                console.error(err);
                if (err.name === 'UnauthorizedError') {
                    res.status(401).json(err.errors);
                } else {
                    next(err);
                }
            }
        },
        verify: async (req, res, next) => {
            try {
                const { token } = req.params;
                const encodedUser = getUserFromJWTToken(token);
                const id = parseInt(encodedUser.id, 10);
                const updatedUser = await UserService.update({ id }, { status: true });
                if (updatedUser.length === 0) {
                    return res.sendStatus(404);
                }
                const user = updatedUser[0];
                if (user.role === 'merchant') {
                    const credentials = await Credential.create({ user_id: user.id });
                    return res.status(200).json(credentials);
                }
                return res.status(200).json(user);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    console.error(error);
                    res.status(500).json(error);
                }
            }
        },
        check: async (req, res, next) => {
            return res.status(200).send();
        }
    };
};