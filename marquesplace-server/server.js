const express = require("express");
const cors = require("cors");

const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const CartRouter = require("./routes/cart");


const checkFormat = require("./middlewares/check-format");
const checkAuth = require("./middlewares/check-auth");
const UserService = require("./services/user");


const CronService = require("./utils/cron");


const app = express();

app.use(
  cors({
    origin: 'http://localhost:5175'
  })
);


app.use(checkFormat);

app.use(express.json());

app.use("/", SecurityRouter);

app.use("/users", checkAuth, UserRouter);

app.use("/merchant", checkAuth, UserRouter);

app.use("/cart", checkAuth, CartRouter);

const errorHandler = (err, req, res, next) => {
  // Assurez-vous que l'objet d'erreur existe
  if (!err) {
    return next();
  }

  // Affichez l'erreur dans la console pour le débogage
  console.error(err);

  // Vérifiez si l'erreur a un code HTTP personnalisé (dans l'objet d'erreur)
  const statusCode = err.statusCode || 500;

  // Réponse avec l'erreur et le statut approprié
  res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
};

// Utilisez le middleware errorHandler pour gérer toutes les erreurs


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
