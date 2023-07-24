const {
  Operation,
  Transaction,
  OperationHistory,
} = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = function OperationService() {
  return {
    findOne: async function (filters) {
      return Operation.findOne({ where: filters });
    },
    update: async (filters, newData) => {
      try {
        const [nbUpdated, operations] = await Operation.update(newData, {
          where: filters,
          returning: true,
          individualHooks: true,
        });

        await OperationHistory.create({
          status: operations[0].status,
          operation_id: operations[0].id,
        });

        return operations;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    create: async (data) => {
      try {
        const operation = await Operation.create(data);

        await OperationHistory.create({
          status: operation.status,
          operation_id: operation.id,
        });

        return operation;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    refund: async (transaction_ref, refunded_amount) => {
      try {
        const transaction = await Transaction.findOne({
          where: { reference: transaction_ref },
        });

        if (!transaction) {
          throw new UnauthorizedError("Transaction not found");
        }

        const captureOperation = await Operation.findOne({
          where: {
            transaction_id: transaction.id,
            type: "capture",
          },
        });

        if (!captureOperation) {
          throw new UnauthorizedError("Capture operation not found");
        }

        const currentAmount = transaction.amount;

        const refundedOperations = await Operation.findAll({
          where: {
            transaction_id: transaction.id,
            type: "refund",
          },
        });
        const totalRefunded = refundedOperations.reduce(
          (acc, op) => acc + op.amount,
          0
        );

        const remainingToRefund = currentAmount - totalRefunded;

        if (refunded_amount > remainingToRefund) {
          throw new UnauthorizedError(
            "Refunded amount exceeds the remaining amount to be refunded"
          );
        }

        if (captureOperation.status !== "paid") {
          throw new UnauthorizedError("Capture operation is not paid");
        }

        const newAmount = refunded_amount;
        const newStatus = newAmount === currentAmount ? "paid" : "pending";
        await Operation.create({
          type: "refund",
          amount: newAmount,
          currency: transaction.currency,
          status: newStatus,
          transaction_id: transaction.id,
        });

        return captureOperation;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    getTransactionOperationsHistory: async (transaction_ref) => {
      try {
        const transaction = await Transaction.findOne({
          where: { reference: transaction_ref },
        });

        if (!transaction) {
          throw new UnauthorizedError("Transaction not found");
        }

        const operations = await Operation.findAll({
          where: {
            transaction_id: transaction.id,
          },
          order: [["createdAt", "ASC"]],
        });

        return operations;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
  };
};
