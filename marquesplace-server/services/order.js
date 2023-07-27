const { Order } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");

module.exports = function OrderService() {
    return {
        findAll: async function (filters, options = {}) {
            let dbOptions = {
                where: filters,
            };

            if (options.order) {
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return Order.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Order.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                return await Order.create(data);
            } catch (e) {
                if (e instanceof Sequelize.ValidationError || e instanceof ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
    };
};
