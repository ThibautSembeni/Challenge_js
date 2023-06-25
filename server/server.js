const express = require("express");
const cors = require("cors");

const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const TemplateRouter = require("./routes/route.template");

const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors())

app.use(checkFormat);

app.use(express.json());

app.use("/", SecurityRouter);

app.use("/template", TemplateRouter);

app.use("/users", checkAuth, UserRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
