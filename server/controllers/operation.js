const transactionService = require("../services/transactions")
const TransactionService = new transactionService()
const EventPayement = require('../services/eventPayment')
const eventPayementService = new EventPayement()
const EmailSender = require("../services/emailSender");
const userService = require("../services/user")
const UserService = new userService()
module.exports = function OperationController(OperationService, options = {}) {
    return {
        resultFromPsp: async (req, res, next) => {
            try {
                const { result, operation_id } = req.body
                let status = 'failed'

                const currentOperation = await eventPayementService.getOperation(operation_id)
                const currentTransaction = await eventPayementService.getTransaction(currentOperation.transaction_reference)

                if (currentTransaction.currentState.status === 'created' && result === true) {
                    status = 'captured'
                } else if (currentTransaction.currentState.status === 'created' && result === false) {
                    status = 'failed'
                } else if (currentTransaction.currentState.status === 'captured' && result === true) {
                    const operations = await eventPayementService.getAllOperations(currentTransaction.currentState.transaction_reference, 'refund')

                    if (!operations.length) {
                        if (currentOperation.amount < currentTransaction.currentState.amount) status = 'partially_refunded'
                        else status = 'refunded'
                    } else {
                        let totalRefund = 0
                        operations.forEach(operation => {
                            totalRefund += operation.amount
                        })

                        if (totalRefund < currentTransaction.currentState.amount) status = 'partially_refunded'
                        else status = 'refunded'
                    }
                } else if (currentTransaction.currentState.status === 'captured' && result === false) {
                    status = 'failed'
                }

                await eventPayementService.updateTransaction(currentOperation.transaction_reference, { status })
                await EmailSender.sendEmailForOperation({ firstname: currentTransaction.currentState.client_info.name.split(' ')[0], lastname: currentTransaction.currentState.client_info.name.split(' ')[1], email: currentTransaction.currentState.client_info.email }, status)
                res.sendStatus(200);
            } catch (e) {
                console.log(e);
                next(e);
            }
        },
    };
};
