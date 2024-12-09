// bitcoinService.js
const bitcoin = require("bitcoinjs-lib");
const axios = require("axios");

async function sendBitcoin({
  fromAddress,
  toAddress,
  amountSatoshis,
  privateKeyWIF,
  network = bitcoin.networks.testnet, // Use bitcoin.networks.bitcoin for mainnet
  feeSatoshis = 1000, // Set a reasonable fee
}) {
  try {
    // Fetch UTXOs for the fromAddress
    const utxos = await axios.get(
      `https://blockstream.info/testnet/api/address/${fromAddress}/utxo`
    );

    if (utxos.data.length === 0) {
      throw new Error("No UTXOs available for this address");
    }

    // Create a new transaction builder
    const txb = new bitcoin.TransactionBuilder(network);

    // Add inputs (UTXOs)
    let inputAmount = 0;
    utxos.data.forEach((utxo) => {
      txb.addInput(utxo.txid, utxo.vout);
      inputAmount += utxo.value;
    });

    // Check if input amount is sufficient
    if (inputAmount < amountSatoshis + feeSatoshis) {
      throw new Error("Insufficient balance");
    }

    // Add output (recipient)
    txb.addOutput(toAddress, amountSatoshis);

    // Add change output if needed
    const change = inputAmount - amountSatoshis - feeSatoshis;
    if (change > 0) {
      txb.addOutput(fromAddress, change);
    }

    // Sign each input
    const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, network);
    utxos.data.forEach((_, index) => {
      txb.sign(index, keyPair);
    });

    // Build the transaction
    const tx = txb.build();
    const txHex = tx.toHex();

    // Broadcast the transaction
    const response = await axios.post(
      "https://blockstream.info/testnet/api/tx",
      txHex
    );
    return response.data; // Return transaction ID
  } catch (error) {
    throw new Error(`Error sending Bitcoin: ${error.message}`);
  }
}

module.exports = { sendBitcoin };
