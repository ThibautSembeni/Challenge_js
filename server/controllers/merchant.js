const {Credential} = require("../db/models/postgres");
const EmailSender = require("../services/emailSender");

module.exports = function merchantController(UserService) {
    return {
        countPendingUsers: async (req, res, next) => {
            try {
                const count = await UserService.count(
                    {role: "merchant", status: 'pending'}
                );
                res.json(count)
            } catch (error) {
                throw new Error('Erreur lors du comptage des utilisateurs en attente.');
            }
        },
        getPendingValidationMerchants: async (req, res, next) => {
            try {
                const {page, itemPerPage, order, ...filters} = req.query;
                const users = await UserService.findAll({role: "merchant", status: 'pending'}, {
                    order: {
                        createdAt: "ASC",
                    },
                    limit: itemPerPage, offset: (page - 1) * itemPerPage
                })
                res.json(users);
            } catch (err) {
                console.error(err);
                if (err.name === 'UnauthorizedError') {
                    res.status(401).json(err.errors);
                } else {
                    next(err);
                }
            }
        },
        approveMerchant: async (req, res, next) => {
            try {
                const { id } = req.params;
                const merchants = await UserService.update({ id }, { status: 'approved' });
                if (merchants.length !== 1) {
                    return res.sendStatus(404)
                }
                const merchant = merchants[0];
                const credentials = await Credential.create({ user_id: merchant.id });
                await EmailSender.sendCredentialsForMerchant(merchant, credentials)
                return res.json(credentials);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        },
        declineMerchant: async (req, res, next) => {
            try {
                const { id } = req.params;
                const merchants = await UserService.update({ id }, { status: 'declined' });
                if (merchants.length !== 1) {
                    return res.sendStatus(404)
                }
                const merchant = merchants[0];
                await EmailSender.sendDeclineMail(merchant)
                res.json(merchant);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        },

    };
};