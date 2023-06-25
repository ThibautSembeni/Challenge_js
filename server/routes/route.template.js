const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const TemplateService = require("../services/srv.template");
const middleware = require("../middlewares/apikey");
const customTemplateController = require("../controllers/controller.template");

module.exports = new genericRouter(
    new genericController(
        new TemplateService(),
        // `customController` if for link controller and service for `customRoutes`
        {
            customController: customTemplateController,
        }
    ),
    {
        // `customRoutes` is optional is for add others custom routes
        customRoutes: [
            { handler: 'getTemplate', method: 'get', path: '/test/test', middleware: [] }
        ],
        // `defaultRoutes` is all resfull routes
        // to desactivate resfull routes set default routes to false like ``defaultRoutes: false``
        defaultRoutes: {
            getAll: { method: 'get', path: '/', middleware: [], active: true },
            create: { method: 'post', path: '/', middleware: [], active: true },
            getOne: { method: 'get', path: '/:id', middleware: [], active: true },
            replace: { method: 'put', path: '/:id', middleware: [], active: true },
            update: { method: 'patch', path: '/:id', middleware: [], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [], active: true },
        },
        // `middlewares` is for set a middleware on all routes over
        middlewares: [middleware]
    }
);