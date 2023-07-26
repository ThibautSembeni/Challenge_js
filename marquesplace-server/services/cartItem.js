const { CartItem, Product} = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function CartItemService() {
  return {
    create: async function (data) {
      return CartItem.create(data);
    },
    findOne: async function (filters) {
      return CartItem.findOne({ where: filters });
    },
    findAll: async function (filters) {
      return CartItem.findAll({ where: filters });
    },
    update: async (filters, newData) => {
      try {
        const [nbUpdated, users] = await CartItem.update(newData, {
          where: filters,
          returning: true,
          individualHooks: true,
        });

        return users;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    delete: async function (filters) {
      return CartItem.destroy({ where: filters });
    },
  };
};