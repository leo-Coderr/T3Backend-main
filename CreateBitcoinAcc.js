// walletGenerator.js
const bip39 = require("bip39");
const ecc = require("tiny-secp256k1");
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");

const bip32 = BIP32Factory(ecc);

function generateBitcoinWallet(seedPhrase, index = 0) {
  // Validate the seed phrase
  if (!bip39.validateMnemonic(seedPhrase)) {
    throw new Error("Invalid seed phrase");
  }

  // Generate seed buffer from the seed phrase
  const seed = bip39.mnemonicToSeedSync(seedPhrase);

  // Create a Bitcoin HD wallet from the seed
  const root = bip32.fromSeed(seed);

  // Derive the account based on BIP44 standard and the provided index
  const account = root.derivePath(`m/44'/0'/0'/0/${index}`);

  // Get the Bitcoin address
  const { address } = bitcoin.payments.p2pkh({ pubkey: account.publicKey });

  // Get the private key in WIF (Wallet Import Format)
  const privateKey = account.toWIF();

  return { address, privateKey };
}

module.exports = { generateBitcoinWallet };
