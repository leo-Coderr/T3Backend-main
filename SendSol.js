const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const bs58 = require("bs58");

// Create a connection to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function sendSol(senderPrivateKey, recipientPublicKey, amount) {
  try {
    // Decode the base58-encoded private key
    const from = Keypair.fromSecretKey(bs58.decode(senderPrivateKey));

    // Check the sender's balance
    const balance = await connection.getBalance(from.publicKey);
    console.log(`Sender's balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    // If balance is insufficient, request an airdrop
    if (balance < amount * LAMPORTS_PER_SOL) {
      console.log("Insufficient balance, requesting airdrop...");
      const airdropSignature = await connection.requestAirdrop(
        from.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSignature);
      console.log("Airdrop completed.");
    }

    // Create a transaction to send SOL
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: new PublicKey(recipientPublicKey),
        lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
      })
    );

    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);
    return { success: true, signature };
  } catch (error) {
    console.error("Error sending SOL:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendSol };
