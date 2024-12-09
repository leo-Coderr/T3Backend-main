const mongoose = require("mongoose");

const Transaction = new mongoose.Schema({
  sovId: {
    type: String,
    required: false,
  },
  txHash: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  fromWallet: {
    type: String,
    required: false,
  },
  toWallet: {
    type: String,
    required: false,
  },
  amount: {
    type: String,
    required: false,
  },
  currency: {
    type: String,
    required: false,
  },
});

const Transactions = new mongoose.model("Transaction", Transaction);
module.exports = Transactions;
