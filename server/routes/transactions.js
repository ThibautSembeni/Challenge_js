const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const TransactionService = require("../services/transactions");
const middleware = require("../middlewares/apikey");
const customTransactionController = require("../controllers/transaction");

module.exports = new genericRouter(
    new genericController(
        new TransactionService(),
        {
            customController: customTransactionController,
        }
    ),
    {
        customRoutes: [
            { method: 'get', path: '/transaction/user/:id', middleware: [], handler: 'getTransactionsByUserId' },
        ],
        defaultRoutes: {
            getAll: { method: 'get', path: '/', middleware: [], active: true },
            create: { method: 'post', path: '/', middleware: [], active: true },
            getOne: { method: 'get', path: '/:reference', middleware: [], active: true },
            replace: { method: 'put', path: '/:id', middleware: [], active: true },
            update: { method: 'patch', path: '/:id', middleware: [], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [], active: true },
        },
    }
);