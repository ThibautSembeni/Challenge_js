const bcrypt = require("bcryptjs");
const { generateVerificationToken } = require("../utils/user");

module.exports = function CustomerController(CustomerService) {
  return {
    create: async (req, res, next) => {
      try {
        const { body } = req;
        const customer = await CustomerService.create(body);
        res.status(201).json(customer);
      } catch (e) {
        if (e.constructor.name === "ValidationError") {
          res.status(422).json(e.errors);
        } else if (e.constructor.name === "UniqueConstraintError") {
          res.status(409).json(e.errors);
        } else {
          console.error(e);
          next(e);
        }
      }
    },
    login: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const customer = await CustomerService.login(email, password);
        const token = await generateVerificationToken(customer);
        res.cookie("token", token, { httpOnly: true });
        res.json({ token });
      } catch (e) {
        console.error(e);
        if (e.name === "UnauthorizedError") {
          res.status(401).json(e.errors);
        } else {
          next(e);
        }
      }
    },
    me: async (req, res, next) => {
      try {
        const { id } = req.user;
        const user = await CustomerService.findOne({ id });
        if (!user) {
          res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
      } catch (e) {
        console.error(e);
        next(e);
      }
    },
  };
};
