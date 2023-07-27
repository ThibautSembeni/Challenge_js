const { Transaction } = require("sequelize");
const operationEvent = require("../services/eventPayment");
const OperationService = new operationEvent();
const { validateCardNumber } = require("../utils/cardValidation");

module.exports = function pspController(CredentialService) {
    return {
        confirm: (req, res, next) => {
            res.status(202).json({ message: "Paiement en cours de traitemen" });
            const { cardInfo, price, currency, operation_id } = req.body;
            let result = false;
            OperationService.update(
                { id: operation_id },
                { status: "processing" }
            );
            setTimeout(() => {
                try {
                    result = validateCardNumber(
                        cardInfo.cardNumber,
                        cardInfo.cardCVC,
                        cardInfo.cardExpiration
                    );
                    OperationService.update(
                        { id: operation_id },
                        { status: "done" }
                    ).then(() => {
                        const payload = {
                            aggregate_id: operation_id,
                            aggregate_type: "Operation",
                            type: "OperationUpdated",
                            status: "done",
                            currency: currency,
                            price: price,
                        };
                        fetch(
                            `${process.env.API_URL}/eventPayment/psp-confirmation`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(payload),
                            }
                        );
                    });
                } catch (e) {
                    throw new Error(`Error From PSP : ${e}`);
                }
            }, 10000);
            if (result === true) {
                return;
            }
        },
    };
};
