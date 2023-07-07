const { db } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function ProductService() {
    return {
        findAll: async function (filters, options = {}) {
            let dbOptions = {
                where: filters,
            };

            // Check if options.order exists before trying to access it
            if (options.order) {
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return db.Product.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return db.Product.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                if (!data.name || data.name.length < 2)
                    throw new ValidationError('Le nom doit contenir au moins 2 caractères');

                if (isNaN(data.stock))
                    throw new ValidationError('Le stock doit être un nombre');

                if (isNaN(data.price))
                    throw new ValidationError('Le prix doit être un nombre');

                if (!data.description || data.description.length < 2 || data.description.length > 5000)
                    throw new ValidationError('La description doit contenir entre 2 et 5000 caractères');

                return await db.Product.create(data);
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
                const [nbUpdated, users] = await db.Product.update(newData, {
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
            return db.Product.destroy({ where: filters });
        },
    };
};