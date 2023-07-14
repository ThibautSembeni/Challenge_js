const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const UserService = require("../services/user");
const merchantController = require("../controllers/merchant");
const checkAdminRole = require("../middlewares/check-roles");
module.exports = new genericRouter(
    new genericController(
        new UserService(),
        {
            customController: merchantController,
        }
    ),
    {
        // `customRoutes` is optional is for add others custom routes
        customRoutes: [
            { handler: 'countPendingUsers', method: 'get', path: '/pending/count', middleware: [checkAdminRole] },
            { handler: 'getPendingValidationMerchants', method: 'get', path: '/pending', middleware: [checkAdminRole] },
            { handler: 'approveMerchant', method: 'get', path: '/approve/:id', middleware: [checkAdminRole] },
            { handler: 'declineMerchant', method: 'get', path: '/decline/:id', middleware: [checkAdminRole] },
        ],
        defaultRoutes: {},
        // `middlewares` is for set a middleware on all routes over
        middlewares: []
    }
)
