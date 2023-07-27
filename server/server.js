const express = require("express");
const cors = require("cors");

const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const TemplateRouter = require("./routes/route.template");
const TransactionRouter = require("./routes/transactions");
const ProductRouter = require("./routes/products");
const AdminRouter = require("./routes/admin");
const CredentialRouter = require("./routes/credentials");
const OperationRouter = require("./routes/operation");
const PspRouter = require("./routes/psp");
const EventPaymentRouter = require("./routes/eventPayment");

const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const trustProxy = require("./middlewares/trust-proxy");
const checkAuth = require("./middlewares/check-auth");
const cookieParser = require('cookie-parser')

const UserService = require("./services/user");

const app = express();

app.use(cookieParser())

if (process.env.NODE_ENV !== "test") {
  app.use(
    cors({
      origin: async (origin, callback) => {
        const origins = await UserService().getOrigins();
        if (origin === process.env.FRONT_URL || origins.includes(origin)) {
          return callback(null, true);
        } else {
          console.error("Not allowed by CORS", origin);
          return callback(new Error("Not allowed by CORS"), false);
        }
      }, credentials: true
    })
  );
}

app.use(trustProxy);

app.use(checkFormat);

app.use(express.json());

app.use("/", SecurityRouter);

app.use("/admin", checkAuth, AdminRouter);

app.use("/template", checkAuth, TemplateRouter);

app.use("/users", checkAuth, UserRouter);

app.use("/transactions", TransactionRouter);

// Pour activer la vérification des credentials pour les marchands
// app.use("/transactions", verifyCredentials, TransactionRouter);

app.use("/products", checkAuth, ProductRouter);

app.use("/credentials", checkAuth, CredentialRouter);

app.use("/operation", OperationRouter);

app.use("/psp", PspRouter);

app.use('/eventPayment', checkAuth, EventPaymentRouter);


app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

module.exports = app;
