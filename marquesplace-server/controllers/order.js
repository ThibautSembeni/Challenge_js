module.exports = function OrderController(OrderService, options = {}) {
    return {
        update: async function (req, res, next) {
            try {
                const data = await OrderService.update({ reference: req.params.reference }, req.body);
                res.status(200).json(data);
            } catch (e) {
                next(e);
            }
        }
    }
};