const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const OperationService = require("../services/operation");
const customOperationController = require("../controllers/operation");

module.exports = new genericRouter(
    new genericController(new OperationService(), {
        customController: customOperationController,
    }),
    {
        customRoutes: [
            {
                method: "post",
                path: "/psp-confirmation",
                middleware: [],
                handler: "resultFromPsp",
            },
            {
                method: "get",
                path: "/psp-subscribe",
                middleware: [],
                handler: "subscribeOperation",
            }
        ],
        defaultRoutes: {},
    }
)
    ;
