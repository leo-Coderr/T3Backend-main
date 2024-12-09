// walletService.js
const { ethers } = require("ethers");

// Replace with your Ethereum provider URL (e.g., Infura or Alchemy)
const providerURL = "https://base-sepolia-rpc.publicnode.com";

// Connect to Ethereum network using a provider
const provider = new ethers.JsonRpcProvider(providerURL);

/**
 * Function to send Ether from Wallet A to Wallet B
 * @param {string} privateKeyA - Private key of Wallet A (sender)
 * @param {string} walletB - Address of Wallet B (recipient)
 * @param {string} amount - Amount of ETH to send
 */
async function sendEther(privateKeyA, walletB, amount) {
  try {
    // Initialize Wallet A with the provider
    const walletA = new ethers.Wallet(privateKeyA, provider);

    // Check balance of Wallet A before the transaction
    const balanceBefore = await provider.getBalance(walletA.address);
    console.log(
      `Balance of Wallet A before transfer: ${ethers.formatEther(
        balanceBefore
      )} ETH`
    );

    // Specify transaction details
    const tx = {
      to: walletB,
      value: ethers.parseEther(amount), // Amount of ETH to send
      gasLimit: 21000, // Basic transaction gas limit
    };

    // Send the transaction using Wallet A
    const transactionResponse = await walletA.sendTransaction(tx);
    console.log(
      "Transaction sent! Awaiting confirmation...",
      transactionResponse.hash
    );

    // Wait for the transaction to be mined
    const receipt = await transactionResponse.wait();
    console.log("Transaction confirmed!", receipt.transactionHash);

    // Check balance of Wallet A after the transaction
    const balanceAfter = await provider.getBalance(walletA.address);
    console.log(
      `Balance of Wallet A after transfer: ${ethers.formatEther(
        balanceAfter
      )} ETH`
    );

    return receipt;
  } catch (error) {
    console.error("Error sending ETH:", error);
    throw new Error("Failed to send ETH. Please check the provided details.");
  }
}

module.exports = { sendEther };
