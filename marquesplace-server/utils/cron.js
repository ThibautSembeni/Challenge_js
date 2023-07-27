const cron = require('node-cron');
const CartService = require('../services/cart');

module.exports = function CronService() {
    return {
        start: async function () {
            cron.schedule('*/30 * * * *', async () => {
                try {
                    const cartService = new CartService();
                    await cartService.removeExpiredItemsFromAllCarts();
                } catch (e) {
                    console.error(e);
                }
            });
        },
    }
}