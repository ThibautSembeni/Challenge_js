const genericRouter = require("./generic");
const transactionController = require("../controllers/transaction");
const TransactionService = require("../services/transactions");
const middleware = require("../middlewares/apikey");
const customTemplateController = require("../controllers/controller.template");

module.exports = new genericRouter(
    new transactionController(
        new TransactionService(),
        {

        }
    ),
    {
        customRoutes: [

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