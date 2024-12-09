const web3 = require("@solana/web3.js");
const bs58 = require("bs58");
const bip39 = require("bip39");
const { derivePath } = require("ed25519-hd-key");

// Function to derive wallet
const deriveWallet = (seedPhrase, accountIndex = 1) => {
  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  const path = `m/44'/501'/${accountIndex}'/0'`;
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const keyPair = web3.Keypair.fromSeed(derivedSeed);
  const publicKey = keyPair.publicKey.toString();

  const privateKey = bs58.encode(Buffer.from(keyPair.secretKey));
  return {
    publicKey,
    privateKey,
  };
};

module.exports = { deriveWallet };
