const transactionService = require("../services/transactions")
const TransactionService = new transactionService()
const EventPayement = require('../services/eventPayment')
const eventPayementService = new EventPayement()
const EmailSender = require("../services/emailSender");
const userService = require("../services/user")
const { notifyUser, notify } = require("../utils/notify.sse");
const http = require("http");
const UserService = new userService()
module.exports = function OperationController(OperationService, options = {}) {
    const subscribers = {};
    const eventsSent = [];
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

                const user = await UserService.findOne({ id: currentTransaction.currentState.merchant_id })

                let responsePsp = {}
                if (result === true) {
                    responsePsp = {
                        'response': 'success',
                        'redirect_url': `${user.confirmation_url}`,
                    }
                } else {
                    responsePsp = {
                        'response': 'error',
                        'redirect_url': `${user.cancellation_url}`,
                    }
                }

                ///////////////////////////////////////////////
                // TODO pour la prod :
                ///////////////////////////////////////////////


                // const response = await fetch(`${user.merchant_url}/webhook`, {
                // const response = await fetch(`http://node_marquesplace:4000/webhook`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify(responsePsp)
                // });

                // if (!response.ok) {
                //     throw new Error('Failed to send notification');
                // }

                notify({ id: Math.random(), name: "paymentResult", data: responsePsp }, false, subscribers, eventsSent);

                res.sendStatus(200);
            } catch (e) {
                console.log(e);
                next(e);
            }
        },
        subscribeOperation: async (req, res, next) => {
            const { reference } = req.query;
            subscribers[reference] = res;
            const headers = {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            };
            res.writeHead(200, headers);
        },
    };
};
