const { ethers } = require("ethers");

// Function to create a wallet from a seed phrase and index
async function createWalletFromSeed(phrase, index) {
  try {
    // Verify if the provided phrase is valid
    if (!ethers.Mnemonic.isValidMnemonic(phrase)) {
      throw new Error("Invalid seed phrase");
    }

    // Create the mnemonic object
    const mnemonic = ethers.Mnemonic.fromPhrase(phrase);

    // Create an HDNode from the mnemonic with a specific derivation path
    const derivationPath = `m/44'/60'/0'/0/${index}`;
    const hdNode = ethers.HDNodeWallet.fromMnemonic(mnemonic, derivationPath);

    // Get wallet address and private key
    const walletAddress = hdNode.address;
    const privateKey = hdNode.privateKey;

    // Return the address and private key
    return {
      walletAddress,
      privateKey,
    };
  } catch (error) {
    // Return error if something goes wrong
    throw new Error(`Error creating wallet: ${error.message}`);
  }
}

// Export the function for use in other files
module.exports = { createWalletFromSeed };
