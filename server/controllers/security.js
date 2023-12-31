const { getUserFromJWTToken, generateVerificationToken, generateToken, validateDTORegister, validateDTORegisterUpdate } = require("../utils/user");
const EmailSender = require("../services/emailSender");
const ResetPasswordService = require("../services/resetPassword");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ResetPassword = new ResetPasswordService()
module.exports = function SecurityController(UserService) {
    return {
        login: async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const user = await UserService.login(email, password);
                if (user.isActive === false) {
                    res.status(401).json('Activer votre compte');
                }
                const token = await generateVerificationToken(user);
                res.cookie('token', token, { httpOnly: true }).json({ token });

            } catch (err) {
                if (err.name === 'UnauthorizedError') {
                    res.status(401).json(err.errors);
                } else {
                    next(err);
                }
            }
        },
        logout: async (req, res, next) => {
            try {
                res.clearCookie('token');
                return res.sendStatus(200);
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
                const { body } = req;
                const newBody = validateDTORegister(body)
                const user = await UserService.create(newBody);
                const token = await generateVerificationToken(user)
                const encodedToken = Buffer.from(token).toString('base64url');
                const confirmationLink = `${process.env.FRONT_URL}/auth/complete-register/${encodedToken}`
                await EmailSender.accountValidationEmail(user, confirmationLink)
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
                const { token } = req.params;
                const decodedToken = Buffer.from(token, 'base64url').toString();
                const encodedUser = getUserFromJWTToken(decodedToken);
                const id = parseInt(encodedUser.id, 10);
                const updatedUser = await UserService.update({ id }, { isActive: true });
                if (updatedUser.length === 0) {
                    return res.sendStatus(404);
                }
                return res.sendStatus(200)
            } catch (error) {
                if (error.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    console.error(error);
                    next(error);
                }
            }
        },
        me: async (req, res, next) => {
            try {

                const { id } = req.user;
                const user = await UserService.findOne({ id });
                if (!user) {
                    return res.status(404).json({ message: 'Not found user' });
                }
                return res.status(200).json(user);
            } catch (error) {
                console.error('Error during search :', error);
                return res.status(500).json({ message: 'Error during search' });
            }
        },
        refreshToken: async (req, res, next) => {
            try {
                const { token } = req.cookies;
                if (!token) return res.sendStatus(401)
                const user = jwt.verify(token, process.env.JWT_SECRET, {
                    ignoreExpiration: true,
                })
                const newToken = await generateVerificationToken(user)
                res.cookie('token', newToken, { httpOnly: true });
                return res.status(200).json({ token: newToken });
            } catch (e) {
                next(e)
            }
        },
        updateDemandMerchant: async (req, res, next) => {
            const { token } = req.params;
            const decodedToken = Buffer.from(token, 'base64url').toString();
            const encodedUser = getUserFromJWTToken(decodedToken);
            const { id } = encodedUser
            const user = await UserService.findOne({ id })
            if (!user) {
                return res.sendStatus(404)
            }
            try {
                const body = validateDTORegisterUpdate(req.body)
                const updatedUser = await UserService.update({ id }, { status: 'pending', ...body })
                return res.json(updatedUser[0])
            } catch (e) {
                return res.status(500).json(e)
            }
        },
        changePassword: async (req, res, next) => {
            const { currentPassword, newPassword } = req.body
            const { id } = req.user;
            const user = await UserService.findOne({ id })
            const hashedPassword = user.password
            const result = await bcrypt.compare(currentPassword, hashedPassword);
            if (!result) {
                return res.sendStatus(401)
            }
            const updatedUser = await UserService.update({ id }, { password: newPassword })
            return res.json(updatedUser[0])
        },
        forgotPassword: async (req, res, next) => {
            const { email } = req.body
            if (!email) return res.sendStatus(422)
            const user = await UserService.findOne({ email })
            if (!user) return res.sendStatus(200)
            const token = generateToken();
            const confirmation_link = `${process.env.FRONT_URL}/auth/reset-password/${token}`
            const entry = await ResetPassword.create({
                user_id: user.id,
                token: token
            })
            if (entry) await EmailSender.sendForgotPasswordEmail(user, confirmation_link)
            return res.sendStatus(200)
        },
        renderResetPasswordForm: async (req, res, next) => {
            const { token } = req.params
            const entry = await ResetPassword.findOne({ token })
            if (!entry) return res.sendStatus(404)
            const date = new Date();
            const statusCode = entry.expiresAt > date ? 200 : 401
            return res.sendStatus(statusCode)
        },
        resetPassword: async (req, res, next) => {
            const { token } = req.params
            const entry = await ResetPassword.findOne({ token })
            if (!entry) return res.sendStatus(404)

            const { newPassword, confirmNewPassword } = req.body
            if (newPassword !== confirmNewPassword) return res.sendStatus(400)

            const { user_id } = entry

            const user = await UserService.update({ id: user_id }, { password: newPassword })
            if (!user) return res.sendStatus(404)

            await ResetPassword.delete({ user_id })
            res.sendStatus(200)
        },
        getSSEToken: async (req, res, next) => {
            const forwardedBy = req.headers['x-forwarded-by'];
            const token = jwt.sign(
                { ip: forwardedBy },
                process.env.JWT_SECRET,
                {
                    expiresIn: 10000,
                })
            res.status(201).json({ token })
        }
    };
};
