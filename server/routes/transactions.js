const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const TransactionService = require("../services/transactions");
const checkAuth = require("../middlewares/check-auth");
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
            { method: 'get', path: '/transaction/user/:id', middleware: [checkAuth], handler: 'getTransactionsByUserId' },
            { method: 'get', path: '/transaction/subscribe', middleware: [checkAuth], handler: 'subscribe' },
            { method: 'get', path: '/cancel/:reference', middleware: [checkAuth], handler: 'cancelTransaction' },
            { method: 'post', path: '/', middleware: [checkAuth], handler: 'transaction' },
            { method: 'get', path: '/stats/subscribe', middleware: [checkAuth], handler: 'subscribeToTransactionsStats' },
            { method: 'get', path: '/stats/amountbyday', middleware: [checkAuth], handler: 'getTransactionsVolumeByDays' },
            { method: 'get', path: '/stats/numberbyday', middleware: [checkAuth], handler: 'getTransactionsNumberByDays' },
            { method: 'get', path: '/stats/numberbyyear', middleware: [checkAuth], handler: 'getTransactionsNumberByYear' },
            { method: 'get', path: '/stats/status', middleware: [checkAuth], handler: 'getTransactionsStatus' },
            { method: 'get', path: '/transaction/timeline/:reference', middleware: [checkAuth], handler: 'getTransactionTimeline' }
        ],
        defaultRoutes: {
            getAll: { method: 'get', path: '/', middleware: [checkAuth], active: true },
            create: { method: 'post', path: '/', middleware: [checkAuth], active: false },
            getOne: { method: 'get', path: '/:reference', middleware: [checkAuth], active: true },
            replace: { method: 'put', path: '/:id', middleware: [checkAuth], active: true },
            update: { method: 'patch', path: '/:id', middleware: [checkAuth], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [checkAuth], active: true },
        },
    }
);