const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const OrderService = require("../services/order");

module.exports = new genericRouter(
    new genericController(
        new OrderService()
    ),
    {
        customRoutes: [],
        defaultRoutes: {
            create: { method: 'post', path: '/', middleware: [], active: true },
            getOne: { method: 'get', path: '/:id', middleware: [], active: true },
            getAll: { method: 'get', path: '/', middleware: [], active: true },
        },
    }
);
