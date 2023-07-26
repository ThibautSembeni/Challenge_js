const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const ProductService = require("../services/products");
const checkAuth = require("../middlewares/check-auth");
const customProductController = require("../controllers/product");

module.exports = new genericRouter(
    new genericController(
        new ProductService(), {
        customController: customProductController,
    }
    ),
    {
        customRoutes: [],
        defaultRoutes: {
            getAll: { method: 'get', path: '/', middleware: [checkAuth], active: true },
            create: { method: 'post', path: '/', middleware: [checkAuth], active: true },
            getOne: { method: 'get', path: '/:reference', middleware: [checkAuth], active: true },
            replace: { method: 'put', path: '/:id', middleware: [checkAuth], active: true },
            update: { method: 'patch', path: '/:id', middleware: [checkAuth], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [checkAuth], active: true },
        },
    }
);