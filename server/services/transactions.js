const { Transaction, Operation } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

function validateData(data) {
  if (!data.client_info.name)
    throw new ValidationError("Le nom du client est obligatoire");
  if (!data.client_info.email)
    throw new ValidationError("L email du client est obligatoire");
  if (!data.client_info.phoneNumber)
    throw new ValidationError(
      "Le numéro de téléphone du client est obligatoire"
    );
  if (!data.billing_info.address)
    throw new ValidationError("L adresse de facturation est obligatoire");
  if (!data.billing_info.city)
    throw new ValidationError("La ville de facturation est obligatoire");
  if (!data.billing_info.country)
    throw new ValidationError("Le pays de facturation est obligatoire");
  if (!data.billing_info.postalCode)
    throw new ValidationError("Le code postal de facturation est obligatoire");
  if (!data.shipping_info.address)
    throw new ValidationError("L adresse de livraison est obligatoire");
  if (!data.shipping_info.city)
    throw new ValidationError("La ville de livraison est obligatoire");
  if (!data.shipping_info.country)
    throw new ValidationError("Le pays de livraison est obligatoire");
  if (!data.shipping_info.postalCode)
    throw new ValidationError("Le code postal de livraison est obligatoire");
  if (!data.currency || data.currency.length < 2)
    throw new ValidationError("La devise est obligatoire");
}

const mongoDB = require("../db/models/mongo");

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

          const createdTransaction = await Transaction.create(data);

          await Operation.create({
            type: "capture",
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            transaction_id: createdTransaction.id,
          });

          return createdTransaction;
        } catch (e) {
          if (
            e instanceof Sequelize.ValidationError ||
            e instanceof ValidationError
          ) {
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
            const [nbUpdated, users] = await Transaction.update(newData, {
                where: filters,
                returning: true,
                individualHooks: true,
            });

      return users;
      } catch (e) {
        if (
          e instanceof Sequelize.ValidationError ||
          e instanceof ValidationError
        ) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    delete: async (filters) => {
        return Transaction.destroy({ where: filters });
    },
    getTransactionsVolumeByDays: async (data) => {
        try {
            const transactions = await mongoDB.Transaction.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(data.start_date),
                            $lt: new Date(data.end_date),
                        },
                    },
                },
                {
                    $project: {
                        hour: {
                            $hour: "$createdAt",
                        },
                        amount: 1,
                    },
                },
                {
                    $group: {
                        _id: "$hour",
                        totalAmount: {
                            $sum: "$amount",
                        },
                    },
                },
                {
                    $sort: {
                        "_id.hour": 1,
                    },
                },
            ]);
            return transactions;
        } catch (error) {
            throw error;
        }
    },
    getTransactionsNumberByDays: async (data) => {
        try {
            const transactions = await mongoDB.Transaction.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(data.start_date),
                            $lte: new Date(data.end_date),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                            },
                        },
                        count: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            return transactions;
        } catch (error) {
            throw error;
        }
    },
    getTransactionsNumberByYear: async (year) => {
        try {
            const transactions = await mongoDB.Transaction.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lte: new Date(`${year}-12-31T00:00:00.000Z`),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateFromParts: {
                                year: {
                                    $year: "$createdAt",
                                },
                                month: {
                                    $month: "$createdAt",
                                },
                            },
                        },
                        count: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            return transactions;
        } catch (error) {
            throw error;
        }
    },
    };
};
