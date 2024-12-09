const { Keypair } = require("@solana/web3.js");
const bip39 = require("bip39");
const { derivePath } = require("ed25519-hd-key");

/**
 * Function to create a new Solana wallet with a mnemonic seed phrase
 * @returns {Object} - Returns an object containing wallet details: publicKey, secretKey, and seedPhrase
 */
async function createSolanaWallet() {
  // Generate a random mnemonic (seed phrase)
  const seedPhrase = bip39.generateMnemonic();

  // Convert the mnemonic to a seed
  const seed = await bip39.mnemonicToSeed(seedPhrase);

  // Derive the key pair using ed25519 derivation from the seed
  const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString("hex")).key;
  const wallet = Keypair.fromSeed(derivedSeed);

  // Extract the public and private keys
  const publicKey = wallet.publicKey.toBase58();
  const secretKey = Buffer.from(wallet.secretKey).toString("hex");

  return { publicKey, secretKey, seedPhrase };
}

module.exports = { createSolanaWallet };
