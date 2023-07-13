const { Operation } = require('../db');
const Sequelize = require('sequelize');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UniqueConstraintError = require('../errors/UniqueConstraintError');
const { getScrappingExchangeRates } = require('../utils/scrapping');

module.exports = function OperationService() {
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
            return Operation.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Operation.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                return await Operation.create(data);
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        replace: async function (filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const operation = await this.create(newData);
                return [[operation, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, operations] = await Operation.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });

                return operations;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async (filters) => {
            return Operation.destroy({ where: filters });
        },
        capture: async (transaction) => {
            try {
                const operation = await Operation.findOne({ where: { transaction_id: transaction.id } });
                if (operation) {
                    throw new UniqueConstraintError('Operation already exists');
                }
                return await Operation.create({
                    type: 'capture',
                    transaction_id: transaction.id,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    status: 'succeeded',
                    user_id: transaction.user_id,
                    cart: transaction.cart,
                });
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        refund: async (transaction, refunded_amount, currency) => {
            try {
                if (currency != transaction.currency) { 
                    const exchangeRates = await getScrappingExchangeRates();
                    refunded_amount = refunded_amount * exchangeRates[currency];
                }

                const operation = await Operation.findOne({ where: { transaction_id: transaction.id, type: 'refund' } });
                if (operation) {
                    throw new UniqueConstraintError('Operation already exists');
                }

                const currentAmount = transaction.amount;
                let newAmount = currentAmount - refunded_amount;

                if (newAmount < 0) {
                    throw new UnauthorizedError('Refunded amount is greater than the transaction amount');
                }

                return await Operation.update({
                    type: 'refund',
                    amount: newAmount,
                    status: 'succeeded',
                });
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        }
    };
};