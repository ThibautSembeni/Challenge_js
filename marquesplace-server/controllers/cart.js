const cartItem = require("../services/cartItem")
const CartItemService = cartItem()
module.exports = function CartController(CartService, options = {}) {
    return {
        addItemToCart: async function (req, res, next) {
            const user = req.user
            const {product} = req.body
            const {quantity, price} = product
            console.log("req.body", req.body)
            const product_id = +product.id
            const totalPrice = +(quantity * price)
            let cart = await CartService.findOne({user_id: user.id})
            if (!cart) {
                console.log("okk")
                cart = await CartService.create({user_id: user.id, total_price: totalPrice})
            }
            const cartItem = await CartItemService.findOne({cart_id: cart.id, product_id: product_id})
            if (cartItem) {
                const ancienQuantity = cartItem.quantity
                const newQuantity = cartItem.quantity + quantity
                const newPrice = +(newQuantity * price)
                const updateCartItem = await CartItemService.update({cart_id: cart.id}, {
                    quantity: newQuantity,
                    price: newPrice
                })
            } else {
                const newCartItem = await CartItemService.create({
                    quantity: quantity,
                    price: price,
                    product_id: product_id,
                    product: product,
                    cart_id: cart.id
                })

            }
            res.status(201)
        },
        removeItemFromCart: async function (req, res, next) {
            // res.json("remove")
            try {
                const {cartId, cartItemId} = req.params;
                // res.json({cartItemId,cartId})
                const cartItem = await CartItemService.delete({id: cartItemId});
                if (!cartItem) {
                    res.status(404).json({error: "Cart not found"});
                } else {
                    res.status(204).json(cartItem);
                    const newPrice = +(cartItem.price * cartItem.quantity)
                    const cart = await CartService.findOne({id: cartId})

                    const updatedCart = await CartService.update({id: cartId}, {total_price: cart.total_price - newPrice})
                }
            } catch (e) {
                res.status(500).json({error: e.message});
            }
        },
        getCartByUserId: async function (req, res, next) {
            try {
                const userId = req.params.id;
                const cart = await CartService.findOne({user_id: userId});
                // const cartItems = await CartItemService.findAll({cart_id:cart.id})
                if (!cart) {
                    res.status(404).json({error: "Cart not found"});
                } else {
                    res.json(cart);
                }
            } catch (e) {
                res.status(500).json({error: e.message});
            }
        },
    }
};