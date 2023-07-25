const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const TransactionService = require("../services/transactions");
const checkAuth = require("../middlewares/check-auth");
const checkSSE = require("../middlewares/check-sse");
const checkMerchant = require("../middlewares/check-merchant");
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
            { method: 'get', path: '/cancel/:reference', middleware: [checkAuth], handler: 'cancelTransaction' },
            { method: 'get', path: '/transaction/subscribe', middleware: [checkSSE], handler: 'subscribe' },
            { method: 'post', path: '/', middleware: [checkAuth, checkMerchant], handler: 'transaction' },
            { method: 'get', path: '/stats/subscribe', middleware: [checkSSE], handler: 'subscribeToTransactionsStats' },
            { method: 'get', path: '/stats/amountbyday', middleware: [checkAuth], handler: 'getTransactionsVolumeByDays' },
            { method: 'get', path: '/stats/numberbyday', middleware: [checkAuth], handler: 'getTransactionsNumberByDays' },
            { method: 'get', path: '/stats/numberbyyear', middleware: [checkAuth], handler: 'getTransactionsNumberByYear' },
        ],
        defaultRoutes: {
            getAll: { method: 'get', path: '/', middleware: [checkAuth, checkMerchant], active: true },
            create: { method: 'post', path: '/', middleware: [checkAuth, checkMerchant], active: false },
            getOne: { method: 'get', path: '/:reference', middleware: [checkAuth, checkMerchant], active: true },
            replace: { method: 'put', path: '/:id', middleware: [checkAuth, checkMerchant], active: true },
            update: { method: 'patch', path: '/:id', middleware: [checkAuth, checkMerchant], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [checkAuth, checkMerchant], active: true },
        },
    }
);