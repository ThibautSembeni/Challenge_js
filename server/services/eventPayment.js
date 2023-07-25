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

        updateTransaction: async (reference, data) => {
            let _ = require('lodash');

            const transaction = await Transaction.findOne( {where :{ reference: reference }});

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

            return transaction;
        },

        getTransaction: async (reference) => {
            let _ = require('lodash');

            const transaction = await Transaction.findOne( {where :{ reference: reference }});

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

            // Start creating timeline
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

            // Sort timeline events by timestamp
            timeline.sort((a, b) => a.timestamp - b.timestamp);

            return { currentState, timeline };
        },

        getAllTransactions: async () => {
            let _ = require('lodash');

            const transactions = await Transaction.findAll();

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
        },



        createOperation: async (data) => {
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
