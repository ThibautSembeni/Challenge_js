const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    operations: [
        { status: String, amount: Number, type: String }
    ],
    transaction_reference: { type: String, required: false },
    transaction_id: { type: Number, required: false },
    amount: { type: Number, required: false },
    currency: { type: String, required: false },
    status: { type: String, required: false },
    client_info: { type: Object, required: false },
    merchant: { type: Object, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
