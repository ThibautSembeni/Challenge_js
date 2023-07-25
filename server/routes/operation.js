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
                path: "/",
                middleware: [],
                handler: "capture",
            },
            {
                method: "post",
                path: "/psp-confirmation",
                middleware: [],
                handler: "resultFromPsp",
            },
            {
                method: "post",
                path: "/refund",
                middleware: [],
                handler: "refund",
            },
            {
                method: "get",
                path: "/transaction/:transaction_ref",
                middleware: [],
                handler: "getTransactionOperationsHistory",
            },
        ],
        defaultRoutes: {
            getOne: {
                method: "get",
                path: "/:reference",
                middleware: [],
                active: true,
            },
            update: {method: "patch", path: "/:id", middleware: [], active: true},
        },
    }
)
;
