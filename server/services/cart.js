const { Cart, CartItem, Product } = require('../db/models');
const Sequelize = require('sequelize');
const ValidationError = require('../errors/ValidationError');

module.exports = function CartService() {
    return {
        findAll: async function (filters, options = {}) {
            let dbOptions = {
                where: filters,
                include: {
                    model: CartItem,
                    as: 'items',
                },
            };

            // Check if options.order exists before trying to access it
            if (options.order) {
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return Cart.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Cart.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                if(isNaN(data.total_price))
                    throw new ValidationError('Le prix total doit être un nombre');
                if (!data.userId)
                    throw new ValidationError('Le panier doit être associé à un utilisateur');

                return await Cart.create(data);
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
                const [nbUpdated, carts] = await Cart.update(newData, { where: filters });
                return carts;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async (filters) => {
            return Cart.destroy({ where: filters });
        }
    };
};