const mongoose = require("mongoose");

function generateSovid() {
  const prefix = "did:sovid:discoverynet:";
  const suffix = [...Array(10)]
    .map(() => Math.random().toString(36)[2])
    .join("");
  return prefix + suffix;
}

const WalletSchema = new mongoose.Schema({
  sovId: {
    type: String,
    required: false,
    unique: true,
    default: generateSovid,
  },
  wallet: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  seedPhrase: {
    type: String,
    required: false,
  },
  privateKey: {
    type: String,
    required: false,
  },
  addressIndex: {
    type: String,
    required: false,
  },
});

const user = new mongoose.model("Account", WalletSchema);
module.exports = user;
