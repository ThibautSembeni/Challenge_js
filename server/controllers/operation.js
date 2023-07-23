module.exports = function OperationController(OperationService, options = {}) {
  return {
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
  };
};
