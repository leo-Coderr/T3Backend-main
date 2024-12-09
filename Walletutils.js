// walletUtils.js
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { Slip10, Slip10Curve, Slip10RawIndex } = require("@cosmjs/crypto");
const bip39 = require("bip39");
const { toHex } = require("@cosmjs/encoding");

const generateWalletFromSeed = async (seedPhrase, addressIndex) => {
  try {
    console.log("Generating wallet from seed phrase:", seedPhrase);
    console.log("Using address index:", addressIndex);

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(seedPhrase, {
      prefix: "ssi",
      hdPaths: [
        [
          Slip10RawIndex.hardened(44),
          Slip10RawIndex.hardened(118),
          Slip10RawIndex.hardened(0),
          Slip10RawIndex.normal(0),
          Slip10RawIndex.normal(addressIndex),
        ],
      ],
    });
    const accounts = await wallet.getAccounts();

    const address = accounts[0].address;

    const seed = await bip39.mnemonicToSeed(seedPhrase);
    const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, seed, [
      Slip10RawIndex.hardened(44),
      Slip10RawIndex.hardened(118),
      Slip10RawIndex.hardened(0),
      Slip10RawIndex.normal(0),
      Slip10RawIndex.normal(addressIndex),
    ]);

    const privkeyHex = toHex(privkey);

    console.log("Seed Phrase:", seedPhrase);
    console.log("Address:", address);
    console.log("Private Key:", privkeyHex);

    return { seedPhrase, address, privkey: privkeyHex, addressIndex };
  } catch (error) {
    console.error("Error in generateWalletFromSeed:", error);
    throw new Error("Failed to generate wallet");
  }
};

module.exports = { generateWalletFromSeed };
