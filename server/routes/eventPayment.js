const genericRouter = require("./generic");
const EventService = require("../services/eventPayment");
const eventPaymentController = require("../controllers/eventPayment");
const checkMerchant = require("../middlewares/check-merchant");

module.exports = new genericRouter(
    eventPaymentController(new EventService()),
    {
        customRoutes: [
            { handler: 'createTransaction', method: 'post', path: '/transaction', middleware: [] },
            { handler: 'createTransactionMerchant', method: 'post', path: '/transactionMerchant', middleware: [checkMerchant] },

            { handler: 'updateTransaction', method: 'put', path: '/transaction/:id', middleware: [] },
            { handler: 'deleteTransaction', method: 'delete', path: '/transaction/:id', middleware: [] },
            { handler: 'getTransaction', method: 'get', path: '/transaction/:id', middleware: [] },
            { handler: 'getAllTransactions', method: 'get', path: '/transaction', middleware: [] },


            { handler: 'createOperation', method: 'post', path: '/operation', middleware: [] },
            { handler: 'updateOperation', method: 'put', path: '/operation/:id', middleware: [] },
            { handler: 'deleteOperation', method: 'delete', path: '/operation/:id', middleware: [] },
            { handler: 'getOperation', method: 'get', path: '/operation/:id', middleware: [] },
            { handler: 'getAllOperations', method: 'get', path: '/operation', middleware: [] },
        ],
        defaultRoutes: {},
    }
);
