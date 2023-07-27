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
            console.log("before first update psp")
            await eventService.updateOperation(data.operation_id, { status: "processing" })
            setTimeout(async () => {
                try {
                    const result = _validatePaymentInfo(data)
                    const payload = {
                        operation_id: data.operation_id,
                        result: result
                    }
                    await eventService.updateOperation(data.operation_id, { status: "done" }).then(async () => {
                        console.log("success update operation with done")
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
            }, 1000);
        },


    };
};