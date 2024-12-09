// unjailValidator.js
const { DirectSecp256k1HdWallet, Registry } = require("soid-wallet");
const { SigningStargateClient } = require("@cosmjs/stargate");
const { MsgCreateId } = require("cosmjs-types-sovid/cosmos/identity/tx");

const rpcEndpoint = "http://165.22.101.17:26657"; // Replace with your RPC endpoint

const fee = {
  amount: [{ denom: "usovid", amount: "0" }],
  gas: "200000",
};

async function unjailValidator(mnemonic, username) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  const [firstAccount] = await wallet.getAccounts();

  const registry = new Registry();
  registry.register("/identity.identity.MsgCreateId", MsgCreateId);

  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { registry }
  );

  const msgUnjail = {
    typeUrl: "/identity.identity.MsgCreateId",
    value: {
      creator: firstAccount.address,
      hash: "7896E9044E4A2FB16052BEA2EA49B50337B2EB00140D1B8C8AA5FCEB06C6407F", // Replace with your actual ticker
      username: username,
    },
  };

  const result = await client.signAndBroadcast(
    firstAccount.address,
    [msgUnjail],
    fee
  );

  return result;
}

module.exports = { unjailValidator };
