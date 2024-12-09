const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
} = require("@cosmjs/stargate");
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
      return;
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
  } catch (error) {
    console.error("Failed to send tokens:", error);
  }
};

// Example usage
const senderAddress = "ssi1hwlpamt7xd6lvj8fq2tlms7feex4uk8mms2dac"; // Replace with sender address
const recipientAddress = "ssi1rjnwyu4f0lq4aev6tnvpc9cj9c26n7xqlhyf89"; // Replace with recipient address
const amount = 50000; // Amount in smallest denomination (e.g., soid for ATOM)
const mnemonic =
  "camp dirt cloth element walk laundry catch pelican ensure sniff rain embrace pole shuffle cross roast bargain vanish segment inhale adult knife city relax"; // Replace with sender's mnemonic

sendTokens(senderAddress, recipientAddress, amount, mnemonic)
  .then(() => console.log("Transaction sent"))
  .catch((err) => console.error(err));
