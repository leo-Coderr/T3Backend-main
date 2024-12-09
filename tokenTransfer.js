const { DirectSecp256k1Wallet } = require("@cosmjs/proto-signing");
const { SigningStargateClient } = require("@cosmjs/stargate");
const fetch = require("node-fetch");

const rpcUrl = "http://146.190.5.120:26657";

const getChainId = async () => {
  const response = await fetch(`${rpcUrl}/status`);
  if (!response.ok) {
    throw new Error(`Failed to fetch node status: ${response.statusText}`);
  }
  const data = await response.json();
  return data.result.node_info.network;
};

const sendTokens = async (
  senderAddress,
  recipientAddress,
  amount,
  privateKey
) => {
  try {
    const chainId = await getChainId();
    console.log(`Chain ID: ${chainId}`);

    // Create wallet from private key
    const wallet = await DirectSecp256k1Wallet.fromKey(
      Buffer.from(privateKey, "hex"),
      "ssi"
    );
    const [account] = await wallet.getAccounts();

    console.log(`Derived Address: ${account.address}`); // Log the derived address

    if (account.address !== senderAddress) {
      console.error(
        "Sender address does not match the derived address from private key"
      );
      return {
        success: false,
        message:
          "Sender address does not match the derived address from private key",
      };
    }

    const client = await SigningStargateClient.connectWithSigner(
      rpcUrl,
      wallet
    );
    console.log("Connected to client");

    const amountFinal = {
      denom: "usovid", // Replace with your token denomination
      amount: String(amount),
    };

    const fee = {
      amount: [
        {
          denom: "usovid", // Replace with your token denomination
          amount: "0",
        },
      ],
      gas: "200000",
    };

    const result = await client.sendTokens(
      senderAddress,
      recipientAddress,
      [amountFinal],
      fee,
      ""
    );

    if (result.code !== undefined && result.code !== 0) {
      throw new Error(
        `Failed to broadcast transaction: ${result.log || result.raw_log}`
      );
    }

    console.log("Transaction successful:", result);

    // Convert BigInt values to strings
    const resultFormatted = {
      ...result,
      gasUsed: result.gasUsed.toString(),
      gasWanted: result.gasWanted.toString(),
    };

    return { success: true, result: resultFormatted };
  } catch (error) {
    console.error("Failed to send tokens:", error);
    return { success: false, message: error.message };
  }
};

module.exports = { sendTokens };
