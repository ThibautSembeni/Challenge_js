const { Transaction, Operation, Event } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function EventPaymentService() {
    return {
        createTransaction: async (data) => {
            const transaction = await Transaction.create(data);

            await Event.create({
                aggregate_id: transaction.id,
                aggregate_type: 'Transaction',
                type: 'TransactionCreated',
                payload: data
            });

            return transaction;
        },

        updateTransaction: async (id, data) => {
            const transaction = await Transaction.findByPk(id);

            if (!transaction) {
                throw new ValidationError('No transaction found');
            }

            await transaction.update(data);

            await Event.create({
                aggregate_id: transaction.id,
                aggregate_type: 'Transaction',
                type: 'TransactionUpdated',
                payload: data
            });

            return transaction;
        },

        deleteTransaction: async (id) => {
            const transaction = await Transaction.findByPk(id);

            if (!transaction) {
                throw new ValidationError('No transaction found');
            }
            await transaction.destroy();

            await Event.create({
                aggregate_id: id,
                aggregate_type: 'Transaction',
                type: 'TransactionDeleted'
            });
        },

        getTransaction: async (id) => {
            const transaction = await Transaction.findByPk(id);

            if (!transaction) {
                throw new ValidationError('No transaction found');
            }

            return transaction;
        },

        getAllTransactions: async () => {
            return Transaction.findAll();
        },




        createOperation: async (data) => {
            const operation = await Operation.create(data);

            // Create event
            await Event.create({
                aggregate_id: operation.id,
                aggregate_type: 'Operation',
                type: 'OperationCreated',
                payload: data
            });

            return operation;
        },

        updateOperation: async (id, data) => {
            const operation = await Operation.findByPk(id);

            if (!operation) {
                throw new ValidationError('No operation found');
            }

            // Update operation
            await operation.update(data);

            // Create event
            await Event.create({
                aggregate_id: operation.id,
                aggregate_type: 'Operation',
                type: 'OperationUpdated',
                payload: data
            });

            return operation;
        },

        deleteOperation: async (id) => {
            const operation = await Operation.findByPk(id);

            if (!operation) {
                throw new ValidationError('No operation found');
            }

            // Delete operation
            await operation.destroy();

            // Create event
            await Event.create({
                aggregate_id: id,
                aggregate_type: 'Operation',
                type: 'OperationDeleted'
            });
        },

        getOperation: async (id) => {
            const operation = await Operation.findByPk(id);

            if (!operation) {
                throw new ValidationError('No operation found');
            }

            return operation;
        },

        getAllOperations: async () => {
            return Operation.findAll();
        },
    };
};
