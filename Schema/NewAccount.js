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
  password: {
    type: String,
    required: false,
  },
  chain: {
    type: String,
    required: false,
  },
});

const Newaccounts = new mongoose.model("NewAccount", wallet);
module.exports = Newaccounts;
