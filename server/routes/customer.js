const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const CustomerService = require("../services/customer");
const customerController = require("../controllers/customer");
const checkAuth = require("../middlewares/check-auth");

module.exports = new genericRouter(
  new genericController(new CustomerService(), {
    customController: customerController,
  }),
  {
    customRoutes: [
      { method: "post", path: "/login", middleware: [], handler: "login" },
      { method: "get", path: "/me", middleware: [checkAuth], handler: "me" },
    ],
    defaultRoutes: {
      create: { method: "post", path: "/", middleware: [], active: true },
    },

    middlewares: [],
  }
);
