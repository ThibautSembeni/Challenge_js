const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const UserService = require("../services/user");
const adminController = require("../controllers/admin");
module.exports = new genericRouter(
    new genericController(
        new UserService(),
        {
            customController: adminController,
        }
    ),
    {
        // `customRoutes` is optional is for add others custom routes
        customRoutes: [
            {handler: 'countPendingUsers', method: 'get', path: '/merchants/pending/count', middleware: []},
            {handler: 'getPendingValidationMerchants', method: 'get', path: '/merchants/pending', middleware: []},
            {handler: 'approveMerchant', method: 'get', path: '/merchants/approve/:id', middleware: []},
            {handler: 'declineMerchant', method: 'get', path: '/merchants/decline/:id', middleware: []},
        ],
        defaultRoutes: {},
        // `middlewares` is for set a middleware on all routes over
        middlewares: []
    }
)
