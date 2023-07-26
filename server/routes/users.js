const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const UserService = require("../services/user");
const userController = require("../controllers/admin");
const checkAuth = require("../middlewares/check-auth");

module.exports = new genericRouter(
    new genericController(
        new UserService(),
        {
            customController: userController,
        }
    ),
    {
        // `customRoutes` is optional is for add others custom routes
        customRoutes: [
            { method: 'get', path: '/user/customers', middleware: [checkAuth,], handler: 'getUsersByMerchantId' },
            { method: 'get', path: '/admin/impersonate', middleware: [checkAuth,], handler: 'isImpersonating' },
            { method: 'post', path: '/admin/impersonate', middleware: [checkAuth,], handler: 'impersonate' },
            { method: 'get', path: '/admin/stopImpersonating', middleware: [checkAuth], handler: 'stopImpersonating' },
        ],

        defaultRoutes: {
            getAll: { method: 'get', path: '/', middleware: [], active: true },
            create: { method: 'post', path: '/', middleware: [], active: true },
            getOne: { method: 'get', path: '/:id', middleware: [], active: true },
            replace: { method: 'put', path: '/:id', middleware: [], active: true },
            update: { method: 'patch', path: '/:id', middleware: [], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [], active: true },
        },
        // `middlewares` is for set a middleware on all routes over
        middlewares: []
    }
);