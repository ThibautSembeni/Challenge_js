const { Transaction } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

function validateData(data) {
    if (!data.client_info.name) throw new ValidationError('Le nom du client est obligatoire');
    if (!data.client_info.email) throw new ValidationError('L email du client est obligatoire');
    if (!data.client_info.phoneNumber) throw new ValidationError('Le numéro de téléphone du client est obligatoire');
    if (!data.billing_info.address) throw new ValidationError('L adresse de facturation est obligatoire');
    if (!data.billing_info.city) throw new ValidationError('La ville de facturation est obligatoire');
    if (!data.billing_info.country) throw new ValidationError('Le pays de facturation est obligatoire');
    if (!data.billing_info.postalCode) throw new ValidationError('Le code postal de facturation est obligatoire');
    if (!data.shipping_info.address) throw new ValidationError('L adresse de livraison est obligatoire');
    if (!data.shipping_info.city) throw new ValidationError('La ville de livraison est obligatoire');
    if (!data.shipping_info.country) throw new ValidationError('Le pays de livraison est obligatoire');
    if (!data.shipping_info.postalCode) throw new ValidationError('Le code postal de livraison est obligatoire');
    if (!data.currency || data.currency.length < 2) throw new ValidationError('La devise est obligatoire');
}


module.exports = function TransactionService() {
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
            return Transaction.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Transaction.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                validateData(data);

                return await Transaction.create(data);
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
                validateData(newData);

                const [nbUpdated, users] = await Transaction.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });

                return users;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError || e instanceof ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },

        delete: async (filters) => {

            return Transaction.destroy({ where: filters });
        },

    };
};