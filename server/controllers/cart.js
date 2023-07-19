module.exports = function CartController(CartService, options = {}) {
    return {
        addItemToCart: async function (req, res, next) {
            try {
                const cartId = req.body.cartId;
                const productRef = req.body.productRef;
                const quantity = req.body.quantity;
                const cart = await CartService.addItemToCart(cartId, productRef, quantity);
                res.json(cart);
            } catch (e) {
                console.log(e);
                next(e);
            }
        },
    }
};