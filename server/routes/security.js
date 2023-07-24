const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const securityController = require("../controllers/security");
const UserService = require("../services/user");
const checkAuth = require("../middlewares/check-auth");

module.exports = new genericRouter(
    new genericController(
        new UserService(),
        // `customController` if for link controller and service for `customRoutes`
        {
            customController: securityController,
        }
    ),
    {
        // `customRoutes` is optional is for add others custom routes
        customRoutes: [
            { handler: 'login', method: 'post', path: '/login', middleware: [] },
            { handler: 'create', method: 'post', path: '/register', middleware: [] },
            { handler: 'verify', method: 'get', path: '/verify/:token/', middleware: [] },
            { handler: 'check', method: 'get', path: '/check', middleware: [checkAuth] },
            { handler: 'me', method: 'get', path: '/me', middleware: [checkAuth] },
            { handler: 'refreshToken', method: 'post', path: '/refresh-token', middleware: [] },
            { handler: 'changePassword', method: 'post', path: '/change-password', middleware: [checkAuth] },
            { handler: 'forgotPassword', method: 'post', path: '/forgot-password', middleware: [] },
            { handler: 'renderResetPasswordForm', method: 'get', path: '/reset-password/:token', middleware: [] },
            { handler: 'resetPassword', method: 'post', path: '/reset-password/:token', middleware: [] },
            { handler: 'getSSEToken', method: 'get', path: '/get-sse-token', middleware: [checkAuth] }
        ],
        // `defaultRoutes` is all resfull routes
        // to desactivate resfull routes set default routes to false like ``defaultRoutes: false``
        defaultRoutes: false,
        // `middlewares` is for set a middleware on all routes over
        middlewares: []
    }
);