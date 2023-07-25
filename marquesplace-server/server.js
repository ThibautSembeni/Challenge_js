const express = require("express");
// const cors = require("cors");

const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const CartRouter = require("./routes/cart");


const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");


const CronService = require("./utils/cron");


const app = express();

/*app.use(
  cors({
    origin: async (origin, callback) => {
      const origins = await UserService().getOrigins();
      if (origin === process.env.FRONT_URL || origins.includes(origin) || origin === 'http://localhost:6000') {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
  })
);*/

//
// app.use(checkFormat);
//
// app.use(express.json());
//
// app.use("/", SecurityRouter);
//
// app.use("/users", checkAuth, UserRouter);
//
// app.use("/merchant", checkAuth, UserRouter);
//
// app.use("/cart", checkAuth, CartRouter);




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
