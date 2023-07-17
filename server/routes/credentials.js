const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const credentialController = require("../controllers/credential");
const CredentialService = require("../services/credential");

module.exports = new genericRouter(
    new genericController(
        new CredentialService(),
        // `customController` if for link controller and service for `customRoutes`
        {
            customController: credentialController,
        }
    ),
    {
        // `customRoutes` is optional is for add others custom routes
        customRoutes: [
            { handler: 'verify', method: 'post', path: '/verify', middleware: [] },
        ],
        // `defaultRoutes` is all resfull routes
        // to desactivate resfull routes set default routes to false like ``defaultRoutes: false``
        defaultRoutes: false,
        // `middlewares` is for set a middleware on all routes over
        middlewares: []
    }
);