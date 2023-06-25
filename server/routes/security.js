const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const securityController = require("../controllers/security");
const UserService = require("../services/user");

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
            { handler: 'create', method: 'post', path: '/register', middleware: [] }
        ],
        // `defaultRoutes` is all resfull routes
        // to desactivate resfull routes set default routes to false like ``defaultRoutes: false``
        defaultRoutes: false,
        // `middlewares` is for set a middleware on all routes over
        middlewares: []
    }
);