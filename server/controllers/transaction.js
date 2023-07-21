module.exports = function transactionController(TransactionService, options = {}) {
    const { notifyUser, notify } = require("../utils/notify.sse");
    const db = require('../db/models/mongo')
    const eventsSent = [];
    const subscribers = {};
    const mongoSubscribers = {};
    const messages = [];

    console.log("watch", db);
    db.Transaction.watch().on('change', async (data) => {
        console.log(data);
        const payload = {}
        payload.start_date = new Date();
        payload.start_date.setHours(0, 0, 0, 0);
        payload.end_date = new Date();
        payload.end_date.setHours(23, 59, 59, 999);
        const results = await TransactionService.getTransactionsVolumeByDays(payload);
        notify({ id: Math.random(), name: "transaction", data: results }, true, mongoSubscribers, eventsSent);
    });

    let result = {
        getOne: async function (req, res, next) {
            try {
                const reference = req.params.reference
                const transaction = await TransactionService.findOne({ reference: reference })
                if (transaction) {
                    res.json(transaction)
                } else {
                    res.status(404).json({ error: "Transaction not found" })
                }
            } catch (e) {
                next(e)
            }
        },
        getTransactionsByUserId: async (req, res, next) => {
            try {
                const id = req.params.id
                const results = await TransactionService.findAll({ user_id: id })
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
            const username = req.query.username;
            subscribers[username] = res;
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
                const results = await TransactionService.create(transaction);
                messages.push(results);
                notify({ id: results.id, name: "transaction", data: results }, false, subscribers, eventsSent);
                res.status(201).json(transaction);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        getTransactionsVolumeByDays: async (req, res, next) => {
            try {
                const start_date = new Date();
                start_date.setHours(0, 0, 0, 0);
                const end_date = new Date();
                end_date.setHours(23, 59, 59, 999);

                const data = {};
                if (req.query.hasOwnProperty("date")) {
                    const { date } = req.query;
                    const dateParts = date.split("-");
                    data.start_date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    data.end_date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 23, 59, 59, 999);
                }

                data.start_date = data.start_date || start_date;
                data.end_date = data.end_date || end_date;

                const results = await TransactionService.getTransactionsVolumeByDays(data);
                res.json(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        subscribeTransactionsVolumeByDays: async (req, res, next) => {
            const id = req.query.id;
            mongoSubscribers[id] = res;
            const headers = {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            };
            res.writeHead(200, headers);
        }
    }

    return result;
}