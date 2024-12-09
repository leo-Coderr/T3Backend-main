// wallet.js
const { DirectSecp256k1Wallet } = require("@cosmjs/proto-signing");
const { fromHex } = require("@cosmjs/encoding");

function isHexString(hex) {
  return typeof hex === "string" && /^[0-9a-fA-F]+$/.test(hex);
}

async function getAddressFromPrivateKey(privateKeyHex, prefix) {
  try {
    if (!isHexString(privateKeyHex) || privateKeyHex.length !== 64) {
      throw new Error(
        "Invalid private key format. It should be a 64-character hexadecimal string."
      );
    }

    // Convert the private key from hex to Uint8Array
    const privateKey = fromHex(privateKeyHex);

    // Create a wallet instance from the private key
    const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, prefix);

    // Get the accounts (addresses) from the wallet
    const accounts = await wallet.getAccounts();

    // The address is in the first account
    const address = accounts[0].address;
    return address;
  } catch (error) {
    throw new Error("Error generating address: " + error.message);
  }
}

module.exports = { getAddressFromPrivateKey };
