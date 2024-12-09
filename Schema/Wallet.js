const mongoose = require("mongoose");

const wallet = new mongoose.Schema({
  seedPhrase: {
    type: String,
    required: false,
  },
  sovId: {
    type: String,
    required: false,
  },
  wallet: {
    type: String,
    required: false,
  },
  privateKey: {
    type: String,
    required: false,
  },
  addressIndex: {
    type: Number,
    required: false,
  },
  chain: {
    type: String,
    required: false,
  },
});

const allWallet = new mongoose.model("allWallet", wallet);
module.exports = allWallet;
