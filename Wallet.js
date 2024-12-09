const { DirectSecp256k1HdWallet, Secp256k1 } = require("@cosmjs/proto-signing");
const { Slip10, Slip10Curve, Slip10RawIndex } = require("@cosmjs/crypto");
const bip39 = require("bip39");
const { fromHex, toHex } = require("@cosmjs/encoding");

const generateWallet = async () => {
  // Generate a new 24-word mnemonic
  const mnemonic = bip39.generateMnemonic(256);

  // Create a wallet from the mnemonic
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "ssi",
  });
  const accounts = await wallet.getAccounts();

  // Extract the first account address
  const address = accounts[0].address;

  // Manually derive the private key from the mnemonic and HD path
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, seed, [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(118),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(0),
  ]);

  const privkeyHex = toHex(privkey);

  console.log("Mnemonic:", mnemonic);
  console.log("Address:", address);
  console.log("Private Key:", privkeyHex);

  return { mnemonic, address, privkey: privkeyHex };
};

generateWallet()
  .then((walletData) => {
    console.log("Wallet generated successfully:", walletData);
  })
  .catch((error) => {
    console.error("Error generating wallet:", error);
  });
