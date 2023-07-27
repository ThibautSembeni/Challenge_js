const transactionService = require("../services/transactions")
const TransactionService = new transactionService()
const EventPayement = require('../services/eventPayment')
const eventPayementService = new EventPayement()
const EmailSender = require("../services/emailSender");
const userService = require("../services/user")
const UserService = new userService()
module.exports = function OperationController(OperationService, options = {}) {
    return {
        capture: async (req, res, next) => {
            try {
                const body = req.body
                const operation = await OperationService.create(body)
                const { cardCVC, cardExpiration, cardNumber } = body

                const transaction = await TransactionService.findOne({ id: body.transaction_id })
                const { billing_info } = transaction
                Object.assign(billing_info, {
                    card_type: "Visa",
                    card_bank: "Stripe HIHI",
                    card_number: cardNumber,
                    expiration_date: cardExpiration,
                    cvc: cardCVC
                })
                // const status = 'captured'
                const updatedTransaction = await TransactionService.update({ id: body.transaction_id }, { billing_info })

                const paymentData = {
                    cardInfo: {
                        cardCVC,
                        cardExpiration,
                        cardNumber
                    },
                    price: body.price,
                    currency: body.currency,
                    operation_id: operation.id
                };
                const responseFromPsp = await fetch(`${process.env.API_URL}/psp/confirm`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(paymentData)
                })
                if (responseFromPsp.ok && responseFromPsp.status === 202) res.status(201).json(operation)
                else res.status(500)
            } catch (e) {
                console.log(e);
                next(e);
            }
        },
        refund: async (req, res, next) => {
            try {
                const transactionRef = req.body.transaction_ref;
                const refundedAmount = req.body.refunded_amount;
                const operation = await OperationService.refund(
                    transactionRef,
                    refundedAmount
                );
                res.json(operation);
            } catch (e) {
                console.log(e);
                next(e);
            }
        },
        getTransactionOperationsHistory: async (req, res, next) => {
            try {
                const transactionRef = req.params.transaction_ref;
                const operations =
                    await OperationService.getTransactionOperationsHistory(
                        transactionRef
                    );
                res.json(operations);
            } catch (e) {
                console.log(e);
                next(e);
            }
        },
        resultFromPsp: async (req, res, next) => {
            try {
                const { result, operation_id } = req.body
                console.log("on rentre at resultFromPsp");
                const status = result === true ? 'captured' : 'failed'
                const currentOperation = await eventPayementService.getOperation(operation_id)
                const transaction = await eventPayementService.updateTransaction(currentOperation.transaction_reference, { status })
                const currentTransaction = await eventPayementService.getTransaction(currentOperation.transaction_reference)
                await EmailSender.sendEmailForOperation({ firstname: currentTransaction.currentState.client_info.name.split(' ')[0], lastname: currentTransaction.currentState.client_info.name.split(' ')[1], email: currentTransaction.currentState.client_info.email }, status)
                res.sendStatus(200);
            } catch (e) {
                console.log(e);
                next(e);
            }
        },
    };
};
