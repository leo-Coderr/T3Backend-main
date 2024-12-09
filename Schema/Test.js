const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  seedphrase: {
    type: String,
    required: false,
  },
});

const user = new mongoose.model("test", WalletSchema);
module.exports = user;
