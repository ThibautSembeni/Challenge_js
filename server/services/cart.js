const { Cart, CartItem, Product } = require('../db/models/postgres');
const Sequelize = require('sequelize');
const ValidationError = require('../errors/ValidationError');
const cart = require('../controllers/cart');

module.exports = function CartService() {
    async function updateCartTotalPrice(cartId) {
        const cart = await Cart.findOne({ 
            where: { id: cartId }, 
            include: { 
                model: CartItem,
                as: 'cart_items',
            } 
        });

        if(!cart) {
            throw new ValidationError('Le panier n\'existe pas');
        }

        const totalPrice = cart.cart_items.reduce((total, cartItem) => {
            return total + cartItem.quantity * cartItem.price;
        }, 0);

        await Cart.update({ total_price: totalPrice }, { where: { id: cartId } });
    };

    return {
        findOne: async function (filters) {
            return Cart.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                if(isNaN(data.total_price)) {
                    throw new ValidationError('Le prix total doit être un nombre');
                }
                if (!data.user_id) {
                    throw new ValidationError('Le panier doit être associé à un utilisateur');
                }

                return await Cart.create(data);
            } catch (e) {
                if (e instanceof Sequelize.ValidationError || e instanceof ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, carts] = await Cart.update(newData, { where: filters });
                return carts;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async (filters) => {
            return Cart.destroy({ where: filters });
        },
        updateCartTotalPrice: updateCartTotalPrice, 
        addItemToCart: async (cartId, productRef, quantity) => {
            const cart = await Cart.findOne({ where: { id: cartId } });
            if (!cart) {
                throw new ValidationError('Le panier n\'existe pas');
            }

            const product = await Product.findOne({ where: { reference: productRef } });
            if (!product) {
                throw new ValidationError('Le produit n\'existe pas');
            }

            if(quantity > product.stock) {
                throw new ValidationError('Le stock est insuffisant');
            }

            const cartItem = await CartItem.findOne({ where: { cart_id: cartId, product_id: product.id } });
            if (cartItem) {
                const newQuantity = cartItem.quantity + quantity;

                if(newQuantity > product.stock) {
                    throw new ValidationError('Le stock est insuffisant');
                }

                await CartItem.update({ quantity: newQuantity }, { where: { cart_id: cartId, product_id: product.id } });

                await updateCartTotalPrice(cartId);

                return cartItem;
            } else {
                const newCartItem = await CartItem.create({ 
                    cart_id: cartId, 
                    product_id: product.id, 
                    quantity: quantity,
                    price: product.price,
                });

                await updateCartTotalPrice(cartId);

                return newCartItem;
            }
        },
    };
};

