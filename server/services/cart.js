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
                include: {
                    model: Product,
                    as: 'product',
                }
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
        findAll: async function (filters, options = {}) {
            let dbOptions = {
                where: filters,
                include: {
                    model: CartItem,
                    as: 'cart_items',
                    include: {
                        model: Product,
                        as: 'product',
                    }
                },
            };

            // Check if options.order exists before trying to access it
            if (options.order) {
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return Cart.findAll(dbOptions);
        },
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
        removeItemFromCart: async (cartId, productRef) => {
            const cart = await Cart.findOne({ where: { id: cartId } });
            if (!cart) {
                throw new ValidationError('Le panier n\'existe pas');
            }

            const product = await Product.findOne({ where: { reference: productRef } });
            if (!product) {
                throw new ValidationError('Le produit n\'existe pas');
            }

            const cartItem = await CartItem.findOne({ where: { cart_id: cartId, product_id: product.id } });
            if (!cartItem) {
                throw new ValidationError('Le produit n\'est pas dans le panier');
            }

            const deletedCartItem = await cartItem.destroy();

            if (!deletedCartItem) {
                throw new ValidationError('Le produit n\'est pas dans le panier');
            } else {
                await updateCartTotalPrice(cartId);
                return deletedCartItem;
            }
        },
    };
};

