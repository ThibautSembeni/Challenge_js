const express = require("express");
const cors = require("cors");

const SecurityRouter = require("./routes/security");
const CartRouter = require("./routes/cart");
const OrdersRouter = require("./routes/orders");

const checkFormat = require("./middlewares/check-format");
const checkAuth = require("./middlewares/check-auth");

const StrapeSDK = require("./middlewares/StrapeSDK");
const app = express();

app.use(
  cors({
    origin: process.env.ECOMMERCE_URL
  })
);


app.use(checkFormat);

app.use(express.json());

app.use(StrapeSDK.bind(app)({ client_token: process.env.KAMALPAY_PK, client_secret: process.env.KAMALPAY_SK }))

app.use("/", SecurityRouter);

app.use("/orders", OrdersRouter);

// TODO : a modifiler l'emplacement

app.get('/transactions', checkAuth, async (req, res, next) => {
  const request = await app.getAllTransaction()
  res.status(200).json(request)
})

app.post('/transactions', checkAuth, async (req, res, next) => {
  const result = await app.createTransaction(req.body)
  res.status(200).json(result)
})

app.use("/cart", checkAuth, CartRouter);

const errorHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
};

// END TODO
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

module.exports = app;
