module.exports = function transactionController(TransactionService, options = {}) {
    const { notifyUser, notify } = require("../utils/notify.sse");
    const eventsSent = [];
    const subscribers = {};
    const messages = [];

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
    }

    return result;
}