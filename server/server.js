const express = require("express");
const cors = require("cors");

const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const TemplateRouter = require("./routes/route.template");
const TransactionRouter = require("./routes/transactions");
const ProductRouter = require("./routes/products");
const CartRouter = require("./routes/cart");
const AdminRouter = require("./routes/admin");
const CredentialRouter = require("./routes/credentials");

const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");
const checkAdmin = require("./middlewares/check-admin-role");
const verifyCredentials = require("./middlewares/verify-credentials");

const CronService = require("./utils/cron");

const app = express();

app.use(
  cors({
    origin: process.env.FRONT_URL,
  })
);

app.use(checkFormat);

app.use(express.json());

app.use("/", SecurityRouter);

app.use("/admin", checkAdmin, AdminRouter);

app.use("/template", checkAuth, TemplateRouter);

app.use("/users", checkAuth, UserRouter);

//app.use("/transactions", checkAuth, TransactionRouter);
app.use("/transactions", TransactionRouter);

app.use("/products", checkAuth, ProductRouter);

app.use("/cart", CartRouter);

app.use("/credentials", checkAuth, CredentialRouter);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" });
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

const cronService = new CronService();
cronService.start();

module.exports = app;
