const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
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
  mnemonic
) => {
  try {
    const chainId = await getChainId();
    console.log(`Chain ID: ${chainId}`);

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "ssi",
    });
    const [firstAccount] = await wallet.getAccounts();

    console.log(`Derived Address: ${firstAccount.address}`); // Log the derived address

    if (firstAccount.address !== senderAddress) {
      console.error(
        "Sender address does not match the derived address from mnemonic"
      );
      return {
        success: false,
        message:
          "Sender address does not match the derived address from mnemonic",
      };
    }

    const client = await SigningStargateClient.connectWithSigner(
      rpcUrl,
      wallet
    );
    console.log("Connected to client");

    const amountFinal = {
      denom: "soid", // Replace with your token denomination
      amount: String(amount),
    };

    const fee = {
      amount: [
        {
          denom: "soid", // Replace with your token denomination
          amount: "5000",
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
    return { success: true, result };
  } catch (error) {
    console.error("Failed to send tokens:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendTokens,
};
