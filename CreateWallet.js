const { DirectSecp256k1HdWallet, Secp256k1 } = require("@cosmjs/proto-signing");
const { Slip10, Slip10Curve, Slip10RawIndex } = require("@cosmjs/crypto");
const bip39 = require("bip39");
const { toHex } = require("@cosmjs/encoding");

let addressIndex = 0; // Global address index counter

const generateWalletFromSeed = async (seedPhrase) => {
  // Create a wallet from the given seed phrase
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

  // Extract the account address
  const address = accounts[0].address;

  // Manually derive the private key from the seed phrase and HD path
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

  // Increment the address index for the next wallet generation
  addressIndex += 1;

  return { seedPhrase, address, privkey: privkeyHex };
};

// Example usage
const seedPhrase =
  "close genius zebra tortoise position antenna despair denial wheat lunch loyal diagram"; // Replace with your actual seed phrase

generateWalletFromSeed(seedPhrase)
  .then((walletData) => {
    console.log("Wallet generated successfully:", walletData);
  })
  .catch((error) => {
    console.error("Error generating wallet:", error);
  });
