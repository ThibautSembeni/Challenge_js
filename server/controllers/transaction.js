const EmailSender = require("../services/emailSender");
const userService = require("../services/user")
const UserService = new userService()
module.exports = function transactionController(TransactionService, options = {}) {
    const { notifyUser, notify } = require("../utils/notify.sse");
    const db = require('../db/models/mongo')
    const eventsSent = [];
    const subscribers = {};
    const mongoSubscribers = {};
    const messages = [];

    db.Transaction.watch().on('change', async (data) => {
        const amountByDay = await getTransactionsVolumeByDays();
        const numberByDays = await getTransactionsNumberByDays();
        const numberByYear = await getTransactionsNumberByYear();
        const transactionsStatus = await getTransactionsStatus()
        notify({ id: Math.random(), name: "amountByDay", data: amountByDay }, false, mongoSubscribers, eventsSent);
        notify({ id: Math.random(), name: "numberByDays", data: numberByDays }, false, mongoSubscribers, eventsSent);
        notify({ id: Math.random(), name: "numberByYear", data: numberByYear }, false, mongoSubscribers, eventsSent);
        notify({ id: Math.random(), name: "transactionsStatus", data: transactionsStatus }, false, mongoSubscribers, eventsSent);
    });

    async function getTransactionsVolumeByDays(req = null) {
        const start_date = new Date();
        start_date.setHours(0, 0, 0, 0);
        const end_date = new Date();
        end_date.setHours(23, 59, 59, 999);

        const data = {};
        if (req !== null && req.query.hasOwnProperty("date")) {
            const { date } = req.query;
            const dateParts = date.split("-");
            data.start_date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            data.end_date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 23, 59, 59, 999);
        }

        data.start_date = data.start_date || start_date;
        data.end_date = data.end_date || end_date;

        return await TransactionService.getTransactionsVolumeByDays(data);
    }

    async function getTransactionsNumberByDays(req = null) {
        let data = {};
        if (req === null) {
            const today = new Date();
            const tempStartDate = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('fr-FR')
            data.start_date = tempStartDate.split('/')[2] + '-' + tempStartDate.split('/')[1] + '-' + tempStartDate.split('/')[0]
            const tempEndtDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toLocaleDateString('fr-FR')
            data.end_date = tempEndtDate.split('/')[2] + '-' + tempEndtDate.split('/')[1] + '-' + tempEndtDate.split('/')[0]
        } else {
            data = req.query;
        }
        return await TransactionService.getTransactionsNumberByDays(data);
    }

    async function getTransactionsNumberByYear(req = null) {
        let year = new Date().getFullYear()
        if (req !== null) {
            year = req.query.year;
        }
        return await TransactionService.getTransactionsNumberByYear(year);
    }
    async function getTransactionsStatus(req = null) {
        return await TransactionService.getTransactionsStatus();
    }

    let result = {
        getOne: async function (req, res, next) {
            try {
                const reference = req.params.reference;
                const transactions = await TransactionService.findAll(
                    { merchant_id: req.user.id, reference: reference },
                    { order: { createdAt: 'DESC' } }
                );

                if (transactions && transactions.length > 0) {
                    const transaction = transactions[0];
                    res.json(transaction);
                } else {
                    res.status(404).json({ error: "Transaction not found" });
                }
            } catch (e) {
                next(e);
            }
        },
        getAll: async function (req, res, next) {
            try {
                const transactions = await TransactionService.findAll(
                    { merchant_id: req.user.id },
                    { order: { reference: 'ASC', createdAt: 'DESC' } }
                );

                if (transactions && transactions.length > 0) {
                    let lastTransactions = [];
                    let lastReference = null;

                    for (let transaction of transactions) {
                        if (transaction.reference !== lastReference) {
                            lastTransactions.push(transaction);
                            lastReference = transaction.reference;
                        }
                    }

                    res.json(lastTransactions);
                } else {
                    res.status(404).json({ error: "No transactions found" });
                }
            } catch (e) {
                next(e);
            }
        },
        getTransactionsByUserId: async (req, res, next) => {
            try {
                const id = req.params.id
                const results = await TransactionService.findAll({ merchant_id: req.user.id, user_id: id })
                if (results) {
                    res.json(results)
                } else {
                    res.status(404).json({ error: "Transaction not found" })
                }
            } catch (e) {
                next(e)
            }
        },
        subscribe: async (req, res, next) => {
            const { id } = req.query;
            subscribers[id] = res;
            const headers = {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            };
            res.writeHead(200, headers);
            const lastId = req.query["last-id"];
            if (lastId) {
                eventsSent
                    .filter((m) => m.id > parseInt(lastId))
                    .forEach((m) => notifyUser(m, res));
            }
        },
        transaction: async (req, res, next) => {
            try {
                const transaction = req.body;
                transaction.merchant_id = req.user.id;
                const results = await TransactionService.create(transaction);
                messages.push(results);
                notify({ id: results.id, name: "transaction", data: results }, false, subscribers, eventsSent);
                // const userId = results.user_id
                // const user = await UserService.findOne({id: userId})
                // const operationLink = `${process.env.FRONT_URL}/payment/capture/${results.reference}`
                // await EmailSender.sendEmailForPendingOperation(user, operationLink)
                res.status(201).json(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        cancelTransaction: async (req, res, next) => {
            try {
                const { reference } = req.params;
                const status = "canceled"
                const transaction = await TransactionService.update({ reference }, { status });
                res.json(transaction);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        getTransactionsVolumeByDays: async (req, res, next) => {
            try {
                const results = await getTransactionsVolumeByDays(req);
                res.json(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        subscribeToTransactionsStats: async (req, res, next) => {
            const id = req.query.id;
            mongoSubscribers[id] = res;
            const headers = {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            };
            res.writeHead(200, headers);
        },
        getTransactionsNumberByDays: async (req, res, next) => {
            try {
                const results = await getTransactionsNumberByDays(req);
                res.json(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        getTransactionsNumberByYear: async (req, res, next) => {
            try {
                const results = await getTransactionsNumberByYear(req);
                res.json(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        getTransactionsStatus: async (req, res, next) => {
            try {
                const results = await getTransactionsStatus(req);
                res.json(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        getTransactionTimeline: async (req, res, next) => {
            try {
                const reference = req.params.reference;
                const transactionTimeline = await TransactionService.getTransactionTimeline(reference);
                res.json(transactionTimeline);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
    }

    return result;
}