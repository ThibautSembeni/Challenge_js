const express = require("express");
const cors = require("cors");

const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const TemplateRouter = require("./routes/route.template");
const TransactionRouter = require("./routes/transactions");
const ProductRouter = require("./routes/products");
const MerchantRouter = require("./routes/merchant");
const CartRouter = require("./routes/cart");

const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");

const app = express();

app.use(cors(
))


app.use(checkFormat);

app.use(express.json());

app.use("/", SecurityRouter);

app.use("/template", checkAuth, TemplateRouter);

app.use("/users", checkAuth, UserRouter);

app.use("/merchants", checkAuth, MerchantRouter);

app.use("/transactions", checkAuth, TransactionRouter);

app.use("/products", checkAuth, ProductRouter);

app.use("/cart", CartRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

module.exports = app;
