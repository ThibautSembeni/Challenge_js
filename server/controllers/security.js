const {getUserFromJWTToken, generateVerificationToken, checkTokenMiddleware} = require("../utils/user");
const {Credential} = require("../db/models/postgres");
const EmailSender = require("../services/emailSender");
const jwt = require("jsonwebtoken");

module.exports = function SecurityController(UserService) {
    return {
        login: async (req, res, next) => {
            try {
                const {email, password} = req.body;
                const user = await UserService.login(email, password);
                const token = await generateVerificationToken(user);
                res.cookie('token', token, {httpOnly: true});
                res.json({token});
            } catch (err) {
                console.error(err);
                if (err.name === 'UnauthorizedError') {
                    res.status(401).json(err.errors);
                } else {
                    next(err);
                }
            }
        },
        create: async (req, res, next) => {
            try {
                const {body} = req;

                const user = await UserService.create(body);
                const token = await generateVerificationToken(user)
                const confirmationLink = `${process.env.API_URL}/verify/${token}`

                if (user.role === 'customer') {
                    // await EmailSender.accountValidationEmail(user, confirmationLink)
                } else if (user.role === 'merchant') {
                    // await EmailSender.sendPendingValidationEmail(user)
                }

                return res.status(201).json(user);
            } catch (error) {
                if (error.constructor.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else if (error.constructor.name === 'UniqueConstraintError') {
                    res.status(409).json(error.errors);
                } else {
                    console.error(error);
                    next(error);
                }
            }
        },
        verify: async (req, res, next) => {
            try {
                const {token} = req.params;
                const encodedUser = getUserFromJWTToken(token);
                const id = parseInt(encodedUser.id, 10);
                const updatedUser = await UserService.update({id}, {status: true});
                if (updatedUser.length === 0) {
                    return res.sendStatus(404);
                }
                const user = updatedUser[0];
                return res.status(200).json(user);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    console.error(error);
                    next(error);
                }
            }
        },
        check: async (req, res, next) => {
            return res.status(200).send();
        },
        refreshToken: async (req, res, next) => {
            const {token} = req.body;
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET, {
                    ignoreExpiration: true,
                })
                const newToken = await generateVerificationToken(user)
                return res.status(200).json({ token: newToken });
            } catch (e) {
                next(e)
            }
        }
    };
};