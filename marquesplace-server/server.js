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

// TODO : a modifiler l'emplacement

app.get('/transactions', async (req, res, next) => {
  const [statusCode, data] = await app.getAllTransaction()
  res.sendStatus(statusCode)
})

app.post('/transactions', async (req, res, next) => {
  const [statusCode, data] = await app.createTransaction(req.body)
  res.sendStatus(statusCode).json(data)
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
