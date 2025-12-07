const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balanceUSD: { type: Number, default: 10000 },
  holdings: [{
    symbol: String,
    qty: Number,
    avgPrice: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
