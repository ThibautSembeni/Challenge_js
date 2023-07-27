const { Cart, CartItem, Product } = require("../db/models/postgres");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function CartService() {
  async function updateCartTotalPrice(cartId) {
    const cart = await Cart.findOne({
      where: { id: cartId },
      include: {
        model: CartItem,
        as: "cart_items",
        include: {
          model: Product,
          as: "product",
        },
      },
    });

    if (!cart) {
      throw new ValidationError("Le panier n'existe pas");
    }

    const totalPrice = cart.cart_items.reduce((total, cartItem) => {
      return total + cartItem.quantity * cartItem.price;
    }, 0);

    await Cart.update({ total_price: totalPrice }, { where: { id: cartId } });
  }

  async function removeProductFromCartAfterTime(cartItemId) {
    try {
      const cartItem = await CartItem.findOne({
        where: { id: cartItemId },
        include: {
          model: Product,
          as: "product",
        },
      });
      if (!cartItem) {
        throw new ValidationError("Le produit n'est pas dans le panier");
      }

      const now = new Date();
      const cartItemTimestamp = new Date(cartItem.updatedAt);
      const timeDiffMinutes = Math.floor(
        (now - cartItemTimestamp) / (1000 * 60)
      );

      if (timeDiffMinutes >= 30) {
        await cartItem.destroy();
        const product = cartItem.product;
        const newStock = product.stock + cartItem.quantity;
        await product.update({ stock: newStock });
        await updateCartTotalPrice(cartItem.cart_id);
      }
    } catch (e) {
      if (e instanceof Sequelize.ValidationError) {
        throw ValidationError.fromSequelizeValidationError(e);
      }
      throw e;
    }
  }

  async function removeExpiredItemsFromAllCarts() {
    try {
      const allCarts = await Cart.findAll({
        include: {
          model: CartItem,
          as: "cart_items",
          include: {
            model: Product,
            as: "product",
          },
        },
      });

      for (const cart of allCarts) {
        for (const cartItem of cart.cart_items) {
          await removeProductFromCartAfterTime(cartItem.id);
        }
      }
    } catch (e) {
      if (e instanceof Sequelize.ValidationError) {
        throw ValidationError.fromSequelizeValidationError(e);
      }
      throw e;
    }
  }

  return {
    findOne: async function (filters, options = {}) {
      let dbOptions = {
        where: filters,
        include: {
          model: CartItem,
          as: "cart_items"
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
      return Cart.findOne(dbOptions);
    },
    create: async function (data) {
      try {
        const cart = await Cart.create(data);

        return cart;
      } catch (e) {
        console.error(e);
        if (
          e instanceof Sequelize.ValidationError ||
          e instanceof ValidationError
        ) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    updateCartTotalPrice: updateCartTotalPrice,
    removeProductFromCartAfterTime: removeProductFromCartAfterTime,
    removeExpiredItemsFromAllCarts: removeExpiredItemsFromAllCarts,
    addItemToCart: async (cartId, productRef, productId, quantity) => {
      console.log("cartId", cartId)
      const cart = await Cart.findOne({ where: { id: cartId } });
      if (!cart) {
        throw new ValidationError("Le panier n'existe pas1");
      }

      const product = await fetch('http://localhost:3000/pro')

      if (!product) {
        throw new ValidationError("Le produit n'existe pas2");
      }

      if (quantity > product.stock) {
        throw new ValidationError("Le stock est insuffisant2");
      }

      const cartItem = await CartItem.findOne({
        where: { cart_id: cartId, product_id: productId },
      });
      if (cartItem) {
        const newQuantity = cartItem.quantity + quantity;

        if (newQuantity > product.stock) {
          throw new ValidationError("Le stock est insuffisant");
        }

        await CartItem.update(
          { quantity: newQuantity },
          { where: { cart_id: cartId, product_id: productId } }
        );

        await updateCartTotalPrice(cartId);

        await cartItem.update({ updatedAt: new Date() });

        await removeProductFromCartAfterTime(cartItem.id);

        const updatedStock = product.stock - quantity;
        await product.update({ stock: updatedStock });

        return cartItem;
      } else {
        const newCartItem = await CartItem.create({
          cart_id: cartId,
          product_id: productId,
          quantity: quantity,
          price: product.price,
          updatedAt: new Date(),
        });

        await updateCartTotalPrice(cartId);

        await removeProductFromCartAfterTime(newCartItem.id);

        const updatedStock = product.stock - quantity;
        await product.update({ stock: updatedStock });

        return newCartItem;
      }
    },
    update: async (filters, newData) => {
      try {
        const [nbUpdated, users] = await CartItem.update(newData, {
          where: filters,
          returning: true,
          individualHooks: true,
        });

        return users;
      } catch (e) {
        console.error(e);
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },

    /*    removeItemFromCart: async (cartId, productRef) => {
          const cart = await Cart.findOne({ where: { id: cartId } });
          if (!cart) {
            throw new ValidationError("Le panier n'existe pas");
          }
    
          const product = await Product.findOne({
            where: { reference: productRef },
          });
          if (!product) {
            throw new ValidationError("Le produit n'existe pas");
          }
    
          const cartItem = await CartItem.findOne({
            where: { cart_id: cartId, product_id: product.id },
          });
          if (!cartItem) {
            throw new ValidationError("Le produit n'est pas dans le panier");
          }
    
          const deletedCartItem = await cartItem.destroy();
    
          if (!deletedCartItem) {
            throw new ValidationError("Le produit n'est pas dans le panier");
          } else {
            const itemQuantity = cartItem.quantity;
            const currentStock = product.stock;
    
            if (isNaN(itemQuantity) || isNaN(currentStock)) {
              throw new ValidationError("Quantité ou stock invalide");
            }
    
            const newStock = parseInt(currentStock) + parseInt(itemQuantity);
    
            if (newStock < 0) {
              throw new ValidationError("Stock insuffisant");
            }
    
            await product.update({ stock: newStock });
    
            await updateCartTotalPrice(cartId);
            return deletedCartItem;
          }
        },*/

  };
};
