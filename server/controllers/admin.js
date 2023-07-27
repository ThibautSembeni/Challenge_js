const { Credential } = require("../db/models/postgres");
const ImpersonationService = require("../services/impersonation");
const EmailSender = require("../services/emailSender");

module.exports = function adminController(UserService) {
    return {
        countPendingUsers: async (req, res, next) => {
            try {
                const count = await UserService.count(
                    { role: "merchant", status: 'pending' }
                );
                res.json(count)
            } catch (error) {
                throw new Error('Erreur lors du comptage des utilisateurs en attente.');
            }
        },
        getPendingValidationMerchants: async (req, res, next) => {
            try {
                const { page, itemPerPage, order, ...filters } = req.query;
                const users = await UserService.findAll({ role: "merchant", status: 'pending' }, {
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
                res.json(credentials);
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
                    res.sendStatus(404)
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

        getUsersByMerchantId: async (req, res, next) => {
            try {
                const users = await UserService.getUsersByMerchantId(req.user.id);
                res.json(users);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        },

        impersonate: async (req, res, next) => {
            try {
                const adminId = req.user.id;
                const merchantId = req.body.merchantId;
                const impersonationService = new ImpersonationService()

                await impersonationService.create({ adminId, merchantId });

                res.status(200).json({ message: 'Usurpation start.' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        },

        isImpersonating: async (req, res, next) => {
            try {
                const impersonationService = new ImpersonationService()
                // const adminId = req.user.role !== 'admin' && req.userId !== req.user.id ? req.userId : req.user.id;
                let adminId;
                switch (req.user.role) {
                    case 'admin':
                        adminId = req.user.id;
                        break;
                    case 'merchant':
                        adminId = req.user.id;
                        break;
                    default:
                        adminId = req.user.id;
                        break;
                }
                console.log(adminId, req.user, req.userId)
                const impersonation = await impersonationService.findOne({ adminId });
                res.status(200).json({ status: !!impersonation });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        },

        stopImpersonating: async (req, res, next) => {
            try {
                const impersonationService = new ImpersonationService()
                const nbDeleted = await impersonationService.delete({ adminId: parseInt(req.userId, 10) });
                if (nbDeleted) res.sendStatus(204);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        }
    };
};