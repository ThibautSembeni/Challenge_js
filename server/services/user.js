const { db } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");
const sendAccountValidationEmail = require("./emailSender");
const { generateVerificationToken } = require("../utils/user");
const UserMongoService = require('./mongo/user')

module.exports = function UserService(MongoService) {
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
            return db.User.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return User.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                const user = await db.User.create(data);
                const token = await generateVerificationToken(user)
                const confirmationLink = `${process.env.API_URL}/verify/${token}`
                await sendAccountValidationEmail(user, confirmationLink)
                return user;
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
                const [nbUpdated, users] = await db.User.update(newData, {
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
            return db.User.destroy({ where: filters });
        },
        login: async (email, password) => {
            try {

                const user = await db.User.findOne({ where: { email } });
                if (!user) {
                    throw new UnauthorizedError();
                }
                const isPasswordValid = await user.isPasswordValid(password);
                console.log(isPasswordValid)
                if (!isPasswordValid) {
                    throw new UnauthorizedError();
                }
                return user;
            } catch (error) {
                if (error instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(error);
                }
                throw error;
            }
        },
    };
};