const operationService = require("../services/operation")
const OperationService = new operationService()
module.exports = function pspController(CredentialService) {
    const _validatePaymentInfo = (cardInfo, price, currency) => {
        return Math.random() >= 0.5
    }
    return {
        confirm: (req, res, next) => {
            res.status(202).json({message: 'Paiement en cours de traitemen'});
            const {cardInfo, price, currency, operation_id} = req.body;
            OperationService.update({id: operation_id}, {status: "processing"})
                setTimeout(() => {
                try {
                    const result = _validatePaymentInfo(cardInfo, price, currency)
                    OperationService.update({id: operation_id}, {status: "done"}).then(() => {
                        const payload = {
                            result,
                            operation_id
                        }
                        fetch(`${process.env.API_URL}/operations/psp-confirmation`, {
                            method:'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        })
                    })
                } catch (e) {
                    throw new Error(`Error From PSP : ${e}`)
                }
            }, 10000);
        },


    };
};