const mongoose = require("mongoose");

const paymentHistorySchema = mongoose.Schema({
    payment_id: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    description: { type: String, required: true },
  });
  
  const paymentSchema = mongoose.Schema({
    name: { type: String, required: true },
    wallet_amount: { type: Number, required: true, default: 0 },
    payment_history: [paymentHistorySchema], // Payment history as an array of paymentSchema
  });
  
  module.exports = mongoose.model("Payment", paymentSchema);
