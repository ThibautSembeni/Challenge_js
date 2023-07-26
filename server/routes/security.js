const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const securityController = require("../controllers/security");
const UserService = require("../services/user");
const checkAuth = require("../middlewares/check-auth");

module.exports = new genericRouter(
    new genericController(
        new UserService(),
        {
            customController: securityController,
        }
    ),
    {
        customRoutes: [
            { handler: 'login', method: 'post', path: '/login', middleware: [] },
            { handler: 'logout', method: 'post', path: '/logout', middleware: [] },
            { handler: 'check', method: 'post', path: '/check', middleware: [checkAuth] },
            { handler: 'create', method: 'post', path: '/register', middleware: [] },
            { handler: 'verify', method: 'get', path: '/verify/:token/', middleware: [] },
            { handler: 'me', method: 'get', path: '/me', middleware: [checkAuth] },
            { handler: 'refreshToken', method: 'get', path: '/refresh-token', middleware: [] },
            { handler: 'changePassword', method: 'post', path: '/change-password', middleware: [checkAuth] },
            { handler: 'forgotPassword', method: 'post', path: '/forgot-password', middleware: [] },
            { handler: 'renderResetPasswordForm', method: 'get', path: '/reset-password/:token', middleware: [] },
            { handler: 'resetPassword', method: 'post', path: '/reset-password/:token', middleware: [] },
            { handler: 'getSSEToken', method: 'get', path: '/get-sse-token', middleware: [checkAuth] }
        ],
        defaultRoutes: false,
        middlewares: []
    }
);