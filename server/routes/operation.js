const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const OperationService = require("../services/operation");
//const middleware = require("../middlewares/apikey");
const customOperationController = require("../controllers/operation");

module.exports = new genericRouter(
    new genericController(
        new OperationService(),
        {
            customController: customOperationController,
        }
    ),
    {
        customRoutes: [
            { method: 'get', path: '/operation/user/:id', middleware: [], handler: 'getOperationsByUserId' },
        ],
        defaultRoutes: {
            getAll: { method: 'get', path: '/', middleware: [], active: true },
            create: { method: 'post', path: '/', middleware: [], active: true },
            getOne: { method: 'get', path: '/:reference', middleware: [], active: true },
            replace: { method: 'put', path: '/:id', middleware: [], active: true },
            update: { method: 'patch', path: '/:id', middleware: [], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [], active: true },
        },
    });
