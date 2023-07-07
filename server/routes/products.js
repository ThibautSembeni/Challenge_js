const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const ProductService = require("../services/products");
const middleware = require("../middlewares/apikey");
const customProductController = require("../controllers/product");

module.exports = new genericRouter(
    new genericController(
        new ProductService(),
        {
            customController: customProductController,
        }
    ),
    {
        customRoutes: [

        ],
        defaultRoutes: {
            getAll: { method: 'get', path: '/', middleware: [], active: true },
            create: { method: 'post', path: '/', middleware: [], active: true },
            getOne: { method: 'get', path: '/:reference', middleware: [], active: true },
            replace: { method: 'put', path: '/:id', middleware: [], active: true },
            update: { method: 'patch', path: '/:id', middleware: [], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [], active: true },
        },
    }
);