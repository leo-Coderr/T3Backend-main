const mongoose = require("mongoose");

const wallet = new mongoose.Schema({
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
  chain: {
    type: String,
    required: false,
  },
  index: {
    type: String,
    require: false,
  },
});

const allaccount = new mongoose.model("allaccount", wallet);
module.exports = allaccount;
