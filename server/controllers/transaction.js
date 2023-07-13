module.exports = function transactionController(transactionService, options = {}) {
    const { notifyUser, notify } = require("../utils/notify.sse");
    const eventsSent = [];
    const subscribers = {};
    const messages = [];

    let result = {
        getOne: async function (req, res, next) {
            try {
                const reference = req.params.reference
                const transaction = await transactionService.findOne({ reference: reference })
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
                const results = await transactionService.findAll({ user_id: id })
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
            const transaction = req.body;
            transaction.id = Date.now();
            transaction.date = new Date();
            messages.push(transaction);
            notify({ id: transaction.id, name: "transaction", data: transaction }, false, subscribers, eventsSent);
            res.status(201).json(transaction);
        },
    }

    if (options.hasOwnProperty('customController')) {
        result = { ...result, ...options.customController(transactionService) }
    }

    return result;
}