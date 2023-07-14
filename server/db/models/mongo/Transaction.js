const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    client_info: {
        name: String,
        address: String,
    },
    billing_info: {
        zipcode: String,
        country: String,
        card_type: String,
        card_bank: String,
        card_number: String,
        expiration_date: String,
        cvc: String,
        ip: String,
        device: String,
    },
    shipping_info: {
        amount: Number,
        costs: Number,
        net: Number,
        currency: String,
        payment_type: String,
    },
    cart: {
        card_number: String,
    },
    amount: Number,
    currency: String,
});

module.exports = mongoose.model("Transaction", transactionSchema);
