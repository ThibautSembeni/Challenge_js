const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const ProductService = require("../services/products");
const checkMerchant = require("../middlewares/check-merchant");
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
            getAll: { method: 'get', path: '/', middleware: [checkMerchant], active: true },
            create: { method: 'post', path: '/', middleware: [checkMerchant], active: true },
            getOne: { method: 'get', path: '/:reference', middleware: [checkMerchant], active: true },
            replace: { method: 'put', path: '/:id', middleware: [checkMerchant], active: true },
            update: { method: 'patch', path: '/:id', middleware: [checkMerchant], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [checkMerchant], active: true },
        },
    }
);