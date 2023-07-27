const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const EventService = require("../services/eventPayment");
const eventPaymentController = require("../controllers/eventPayment");

module.exports = new genericRouter(
    new genericController(new EventService(), {
        customController: eventPaymentController,
    }),
    {
        customRoutes: [
            { handler: 'createTransaction', method: 'post', path: '/transaction', middleware: [] },
            { handler: 'updateTransaction', method: 'put', path: '/transaction/:reference', middleware: [] },
            { handler: 'getTransaction', method: 'get', path: '/transaction/:reference', middleware: [] },
            { handler: 'getAllTransactions', method: 'get', path: '/transactions', middleware: [] },

            { handler: 'createOperation', method: 'post', path: '/operation', middleware: [] },
            { handler: 'updateOperation', method: 'put', path: '/operation/:id', middleware: [] },
            { handler: 'getOperation', method: 'get', path: '/operation/:id', middleware: [] },
            { handler: 'getAllOperations', method: 'get', path: '/operations', middleware: [] },
        ],
        defaultRoutes: false,
    }
);
