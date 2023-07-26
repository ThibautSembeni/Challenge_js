const express = require("express");
const cors = require("cors");

const SecurityRouter = require("./routes/security");
const CartRouter = require("./routes/cart");

const checkFormat = require("./middlewares/check-format");
const checkAuth = require("./middlewares/check-auth");

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5175'
  })
);


app.use(checkFormat);

app.use(express.json());

app.use("/", SecurityRouter);

app.use("/cart", checkAuth, CartRouter);

const errorHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
};

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

module.exports = app;
