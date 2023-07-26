const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const CartService = require("../services/cart");
const customCartController = require("../controllers/cart");

module.exports = new genericRouter(
    new genericController(
        new CartService(),
        {
            customController: customCartController,
        }
    ),
    {
        customRoutes: [
            { method: 'get', path: '/user/:id', middleware: [], handler: 'getCartByUserId' },
            { method: 'post', path: '/add', middleware: [], handler: 'addItemToCart' },
            { method: 'delete', path: '/remove/:cartId/:cartItemId', middleware: [], handler: 'removeItemFromCart' },
        ],
        defaultRoutes: {
            create: { method: 'post', path: '/', middleware: [], active: true },
            getOne: { method: 'get', path: '/:id', middleware: [], active: true },
            update: { method: 'patch', path: '/:id', middleware: [], active: true },
            delete: { method: 'delete', path: '/:id', middleware: [], active: true },
        },
    }
);