const { Operation, Event } = require("../db/models/postgres");
const Impersonation = require("./impersonation")
const Transaction = require("./transactions")

const ValidationError = require("../errors/ValidationError");
const {where} = require("sequelize");

module.exports = function EventPaymentService() {
    return {
        createTransaction: async (data) => {
            data.status = 'created';

            const transactionsService = new Transaction();
            const transaction = await transactionsService.create(data);

            await Event.create({
                aggregate_id: transaction.id,
                aggregate_type: 'Transaction',
                type: 'TransactionCreated',
                payload: data
            });

            return transaction.reference;
        },

        updateTransaction: async (reference, data) => {
            let _ = require('lodash');

            const transactionsService = new Transaction();
            const transaction = await transactionsService.findOne( { reference: reference } );

            if (!transaction) {
                throw new ValidationError('No transaction found');
            }

            const transactionEvents = await Event.findAll({
                where: {
                    aggregate_id: transaction.id,
                    aggregate_type: 'Transaction'
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });

            const reconstructedPayload = transactionEvents.reduce((acc, event) => {
                return _.merge({}, acc, event.payload);
            }, {});

            const changes = {};
            for (const key in data) {
                if (!_.isEqual(reconstructedPayload[key], data[key])) {
                    changes[key] = data[key];
                }
            }

            await transaction.update(changes);

            await Event.create({
                aggregate_id: transaction.id,
                aggregate_type: 'Transaction',
                type: 'TransactionUpdated',
                payload: changes,
            });

            return transaction.reference;
        },

        getTransaction: async (reference) => {
            let _ = require('lodash');

            const transactionsService = new Transaction();
            const transaction = await transactionsService.findOne( { reference: reference } );

            if (!transaction) {
                throw new ValidationError('No transaction found');
            }

            const transactionEvents = await Event.findAll({
                where: {
                    aggregate_id: transaction.id,
                    aggregate_type: 'Transaction'
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });

            if (!transactionEvents.length) {
                throw new ValidationError('No events found for this transaction');
            }

            let currentState = transactionEvents[0].payload;

            for (let i = 1; i < transactionEvents.length; i++) {
                const event = transactionEvents[i];
                if(event.type === 'TransactionUpdated'){
                    currentState = _.merge({}, currentState, event.payload);
                }
            }

            currentState.reference = transaction.reference;

            let timeline = transactionEvents.map(event => ({
                timestamp: event.createdAt,
                type: event.type,
                payload: event.payload
            }));

            const operations = await Operation.findAll({ where: { transaction_reference: reference } });

            for (const operation of operations) {
                const operationEvents = await Event.findAll({
                    where: {
                        aggregate_id: operation.id,
                        aggregate_type: 'Operation'
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });

                timeline = timeline.concat(
                    operationEvents.map(event => ({
                        timestamp: event.createdAt,
                        type: event.type,
                        payload: event.payload
                    }))
                );
            }

            timeline.sort((a, b) => a.timestamp - b.timestamp);

            return { currentState, timeline };
        },

        getAllTransactions: async (user) => {
            let _ = require('lodash');

            try {
                const impersonationService = new Impersonation()
                const transactionsService = new Transaction();
                const impersonation = await impersonationService.findOne( { adminId: user.id });

                let transactions = [];

                if (user.role === 'admin' && !impersonation) {
                    transactions = await transactionsService.findAll();
                } else {
                    transactions = await transactionsService.findAll({
                            merchant_id: user.id,
                    });
                }

                if (!transactions.length) {
                    throw new ValidationError('No transactions found');
                }

                const updatedTransactions = [];
                for (const transaction of transactions) {
                    const events = await Event.findAll({
                        where: {
                            aggregate_id: transaction.id,
                            aggregate_type: 'Transaction'
                        },
                        order: [
                            ['createdAt', 'ASC']
                        ]
                    });

                    if (!events.length) {
                        throw new ValidationError('No events found for this transaction');
                    }

                    let currentState = events[0].payload;

                    for (let i = 1; i < events.length; i++) {
                        const event = events[i];
                        if(event.type === 'TransactionUpdated'){
                            currentState = { ...currentState, ...event.payload };
                        }
                    }

                    currentState.reference = transaction.reference;

                    updatedTransactions.push(currentState);
                }

                return updatedTransactions;
            } catch (error) {
                console.log(error);
            }
        },



        createOperation: async (data) => {
            data.status = 'created';

            const transaction = this.getTransaction(data.transaction_reference);
            if (!transaction) {
                throw new ValidationError('No transaction found');
            }

            data.amount = transaction.currentState.amount

            const operation = await Operation.create(data);

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

            const operationEvents = await Event.findAll({
                where: {
                    aggregate_id: operation.id,
                    aggregate_type: 'Operation'
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });

            const reconstructedPayload = operationEvents.reduce((acc, event) => {
                return _.merge({}, acc, event.payload);
            }, {});

            const changes = {};
            for (const key in data) {
                if (!_.isEqual(reconstructedPayload[key], data[key])) {
                    changes[key] = data[key];
                }
            }

            await operation.update(changes);

            await Event.create({
                aggregate_id: operation.id,
                aggregate_type: 'Operation',
                type: 'OperationUpdated',
                payload: changes,
            });

            return operation;
        },

        getOperation: async (id) => {
            const operation = await Operation.findByPk(id);

            if (!operation) {
                throw new ValidationError('No operation found');
            }

            const events = await Event.findAll({
                where: {
                    aggregate_id: operation.id,
                    aggregate_type: 'Operation'
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });

            if (!events.length) {
                throw new ValidationError('No events found for this operation');
            }

            let currentState = events[0].payload;

            for (let i = 1; i < events.length; i++) {
                const event = events[i];
                if(event.type === 'OperationUpdated'){
                    currentState = _.merge({}, currentState, event.payload);
                }
            }

            currentState.transaction_reference = operation.transaction_reference;

            return currentState;
        },

        getAllOperations: async () => {
            const operations = await Operation.findAll();

            const updatedOperations = [];
            for (const operation of operations) {
                const events = await Event.findAll({
                    where: {
                        aggregate_id: operation.id,
                        aggregate_type: 'Operation'
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });

                if (!events.length) {
                    throw new ValidationError('No events found for this operation');
                }

                let currentState = events[0].payload;

                for (let i = 1; i < events.length; i++) {
                    const event = events[i];
                    if(event.type === 'OperationUpdated'){
                        currentState = _.merge({}, currentState, event.payload);
                    }
                }

                currentState.transaction_reference = operation.transaction_reference;

                updatedOperations.push(currentState);
            }

            return updatedOperations;
        },
    };
};
