const EventService = require("../services/eventPayment")
const cardValidation = require("../utils/cardValidation")
const eventService = new EventService()
module.exports = function pspController(CredentialService) {
    const _validatePaymentInfo = (cardInfo) => {
        return cardValidation(cardInfo.cardNumberInput, cardInfo.cardCvvInput, `${cardInfo.cardMonthInput}/${cardInfo.cardYearInput}`)
    }
    return {
        confirm: async (req, res, next) => {
            res.status(202).json({ message: 'Paiement en cours de traitemen' });
            const data = req.body;
            let result = false;

            setTimeout(async () => {
                try {
                    await eventService.updateOperation(data.operation_id, { status: "processing" })

                    if (data.type === 'capture') result = _validatePaymentInfo(data)
                    else {
                        const currentTransaction = await eventService.getTransaction(data.transaction_reference)

                        const operations = await eventService.getAllOperations(data.transaction_reference, 'refund')

                        console.log("operations", operations)

                        if (!operations.length) result = data.amount < currentTransaction.currentState.amount;
                        else {
                            let totalRefund = 0
                            operations.forEach(operation => {
                                totalRefund += operation.amount
                            })

                            console.log("totalRefund", totalRefund)

                            result = totalRefund < currentTransaction.currentState.amount;
                        }
                    }

                    const payload = {
                        operation_id: data.operation_id,
                        result: result
                    }
                    await eventService.updateOperation(data.operation_id, { status: "done" }).then(async () => {
                        await fetch(`${process.env.API_URL}/operation/psp-confirmation`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Origin': process.env.FRONT_URL,
                            },
                            body: JSON.stringify(payload)
                        })
                    })

                } catch (e) {
                    throw new Error(`Error From PSP : ${e}`)
                }
            }, 30000);
        },


    };
};