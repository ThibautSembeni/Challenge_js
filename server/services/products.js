const { Product } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function ProductService() {
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
            return Product.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Product.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                return await Product.create(data);
            } catch (e) {
                if (e instanceof Sequelize.ValidationError || e instanceof ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },

        replace: async function (filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const user = await this.create(newData);
                return [[user, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, users] = await Product.update(newData, {
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
        delete: async (filters) => {
            return Product.destroy({ where: filters });
        },
    };
};