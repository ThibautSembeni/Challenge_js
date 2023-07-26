const { Impersonation } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");


module.exports = function ImpersonationService() {
    return {
        findAll: async function (filters, options) {
            let dbOptions = {
                where: filters,
            };
            // options.order = {name: "ASC", dob: "DESC"}
            if (options.order) {
                // => [["name", "ASC"], ["dob", "DESC"]]
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return Impersonation.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Impersonation.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                return await Impersonation.create(data);
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
        replace: async function (filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const impersonation = await this.create(newData);
                return [[impersonation, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, impersonations] = await Impersonation.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });
                return impersonations;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async (filters) => {
            return User.destroy({ where: filters });
        },
    };
};