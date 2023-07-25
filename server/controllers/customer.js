const bcrypt = require("bcryptjs");

module.exports = function CustomerController(CustomerService) {
  return {
    async create(req, res) {
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
    async login(req, res) {
      try {
        const { email, password } = req.body;
        const customer = await CustomerService.login(email, password);
        res.json(customer);
      } catch (e) {
        console.error(e);
        if (e.name === "UnauthorizedError") {
          res.status(401).json(e.errors);
        } else {
          next(e);
        }
      }
    },
  };
};
