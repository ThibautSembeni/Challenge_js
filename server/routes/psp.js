const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const pspController = require("../controllers/psp");

module.exports = new genericRouter(
    new genericController(
        null,
        // `customController` if for link controller and service for `customRoutes`
        {
            customController: pspController,
        }
    ),
    {
        // `customRoutes` is optional is for add others custom routes
        customRoutes: [
            { handler: 'confirm', method: 'post', path: '/confirm', middleware: [] }
        ],
        // `defaultRoutes` is all resfull routes
        // to desactivate resfull routes set default routes to false like ``defaultRoutes: false``
        defaultRoutes: false,
        // `middlewares` is for set a middleware on all routes over
        middlewares: []
    }
);