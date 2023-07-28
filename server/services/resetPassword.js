const { ResetPassword } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");

module.exports = function ResetPasswordService() {
    return {
        findOne: async function (filters) {
            return ResetPassword.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                return await ResetPassword.create(data);
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
        delete: async (filters) => {
            return ResetPassword.destroy({ where: filters });
        }
    };
};