const { Customer } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = function CustomerService() {
  return {
    findOne: async function (filters) {
      return Customer.findOne({ where: filters });
    },
    create: async function (data) {
      try {
        const customer = await Customer.create(data);

        return customer;
      } catch (e) {
        if (e instanceof Sequelize.UniqueConstraintError) {
          throw UniqueConstraintError.fromSequelizeUniqueConstraintError(e);
        }
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }

        throw e;
      }
    },
    login: async function (email, password) {
      try {
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
          throw new UnauthorizedError();
        }
        if (!customer.isPasswordValid(password)) {
          throw new UnauthorizedError();
        }
        return customer;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
  };
};
