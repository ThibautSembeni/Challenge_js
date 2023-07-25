const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const CustomerService = require("../services/customer");
const customerController = require("../controllers/customer");

module.exports = new genericRouter(
  new genericController(new CustomerService(), {
    customController: customerController,
  }),
  {
    customRoutes: [
      { method: "post", path: "/login", middleware: [], handler: "login" },
    ],

    defaultRoutes: {
      create: { method: "post", path: "/", middleware: [], active: true },
    },

    middlewares: [],
  }
);
