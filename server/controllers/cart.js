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
                next(e);
            }
        },
        removeItemFromCart: async function (req, res, next) {
            try {
                const cartId = req.params.cartId;
                const productRef = req.params.productRef;
                const cart = await CartService.removeItemFromCart(cartId, productRef);
                if(!cart) {
                    res.status(404).json({ error: "Cart not found" });
                } else {
                    res.status(204).json(cart);
                }
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        },
        getCartByUserId: async function (req, res, next) {
            try {
                const userId = req.params.id;
                const cart = await CartService.findAll({ user_id: userId });
                if(!cart) {
                    res.status(404).json({ error: "Cart not found" });
                } else {
                    res.json(cart);
                }
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        },
    }
};