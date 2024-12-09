const express = require("express");
const app = express();
const cors = require("cors");
const bip32 = require("bip32");
const { ethers } = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const { Keypair } = require("@solana/web3.js");
const { HDNodeWallet } = require("ethers");
const Web3 = require("web3");
const Hvi = require("./Schema/Hvi");
const web3 = require("@solana/web3.js");
const path = require("path");
const fs = require("fs");
const bs58 = require("bs58");
const { derivePath } = require("ed25519-hd-key");
const user = require("./Schema/WalletUser");
const { generateWalletFromSeed } = require("./Walletutils");
const { jsonStringifyWithBigInt } = require("./utils");
const dummy = require("./Schema/dummy");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const test = require("./Schema/Test");
const {
  DirectSecp256k1HdWallet,
  encodeSecp256k1PrivateKey,
} = require("@cosmjs/proto-signing");
const { sendEther } = require("./SendEth");
const bip39 = require("bip39");
const { fromHex } = require("@cosmjs/encoding");
const axios = require("axios");
const crypto = require("crypto");

const {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
} = require("@cosmjs/stargate");
const fetch = require("node-fetch");
// const { DirectSecp256k1HdWallet } = require("soid-wallet");

require("dotenv").config();

const mongoose = require("mongoose");
const allWallet = require("./Schema/Wallet");
const { generateNewWallet } = require("./GenerateNewAccount");
const { sendTokens } = require("./tokenTransfer");
const Transactions = require("./Schema/AllTransaction");
const { getAddressFromPrivateKey } = require("./Private");
const { createSolanaWallet } = require("./solanaService");
const Newaccounts = require("./Schema/NewAccount");
const allaccount = require("./Schema/Allaccount");
const { createWalletFromSeed } = require("./CreateEthwallet");
const {
  createSolanaWalletFromSeed,
  deriveWallet,
} = require("./CreateSolanaWallet");
const { sendSol } = require("./SendSol");
const { unjailValidator } = require("./makedid");
const { generateBitcoinWallet } = require("./CreateBitcoinAcc");

require("./database/database");

const port = 8082;

app.use(cors());
app.use(express.json());

app.get("/hello", async (req, res) => {
  try {
    res.status(200).send("hii...");
  } catch (error) {
    console.log(error);
  }
});
// console.log(
//   "process",
//   process.env.ENCRYPTION_KEY,
//   process.env.NOUNCESECRET_KEY
// );

function hashData(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// Encryption

// function encrypt(text) {
//   const algorithm = "aes-256-cbc";
//   const sentence = process.env.ENCRYPTION_KEY;
//   // Assuming nounce_secret is your fixed IV and it's 16 bytes long
//   const iv = Buffer.from(process.env.NOUNCESECRET_KEY.slice(0, 32), "hex");
//   if (iv.length !== 16) {
//     throw new Error("IV must be 16 bytes long");
//   }
//   const secretKey = crypto
//     .createHash("sha256")
//     .update(sentence, "utf8")
//     .digest();
//   const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");

//   return {
//     // iv: iv.toString("hex"),
//     content: encrypted,
//     // key: secretKey.toString("hex"),
//   };
// }

// Decryption
// function decrypt(hash) {
//   const algorithm = "aes-256-cbc";
//   const secretKey = Buffer.from(hash.key, "hex");
//   const iv = Buffer.from(hash.iv, "hex");
//   const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
//   let decrypted = decipher.update(hash.content, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }

// Example usage
const text =
  "glad guard uphold solution invest artist time camp boil wise cupboard play";
// const encrypted = encrypt(text);
// console.log("Encrypted:", encrypted);

// const decrypted = decrypt(encrypted);
// console.log("Decrypted:", decrypted);

///////-----------post api---------

app.post("/post", async (req, res) => {
  try {
    const data = new dummy(req.body);
    await data.save();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

///////-----------get all api---------

app.get("/get", async (req, res) => {
  try {
    const data = await dummy.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

///////-----------get by id api---------

app.get("/get/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await dummy.findById(id);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

///////-----------update by id api---------

app.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updatedData = await dummy.findByIdAndUpdate(id, newData, {
      new: true,
    });
    res.status(200).send(updatedData);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

///////-----------delete by id api---------

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await dummy.findByIdAndDelete(id);
    res.status(200).send("Data deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// -------------ALL API---------------

///////-----------post api---------

app.post("/post-user", async (req, res) => {
  try {
    const data = new user(req.body);
    console.log("d3", data);
    await data.save();
    res.status(200).send({ sovId: data.sovId });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

///////-----------get by id api---------

app.get("/get-user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await user.findById(id);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

///////-----------get by sov-id api---------

app.post("/get-user-by-sovid", async (req, res) => {
  try {
    const { sovId, chain } = req.body;
    const users = await Newaccounts.findOne({ sovId: sovId, chain: chain });
    if (users) {
      res.status(200).json({
        wallet: users.wallet,
        seedPhrase: users.seedPhrase,
        privateKey: users.privateKey,
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

///////----------get user by seedphrase api---------

app.post("/verifyseedphrase", async (req, res) => {
  try {
    const { seedphrase } = req.body;
    console.log("s1", seedphrase);
    const seedphrasehash = hashData(seedphrase);
    console.log("s2", seedphrasehash);

    const users = await user.findOne({ seedphrase: seedphrasehash });
    console.log("s3", users);
    if (users) {
      res.status(200).send({ sovid: users.sovid });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// ---------------find user through password---------

app.post("/password", async (req, res) => {
  try {
    const { password, sovId } = req.body;
    console.log("p1", password, sovId);
    const data = await user.findOne({ password: password, sovId: sovId });
    console.log("p2", data);
    if (data) {
      res.status(200).send(true);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

///-----------update password and import seedphrase---------

app.post("/updatepassword", async (req, res) => {
  try {
    const { sovid, password } = req.body;
    console.log("t1", sovid, password);
    const users = await user.findOne({ sovid: sovid });
    console.log("t2", users);
    if (users) {
      users.password = password;
      await users.save();
      res.status(200).send("password updated");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// ----------------GENERATE WALLET----------------

app.post("/generatewallet", async (req, res) => {
  try {
    const generateWallet = async () => {
      // Generate a new wallet with a 24-word mnemonic
      const mnemonic = bip39.generateMnemonic(256);
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
      const accounts = await wallet.getAccounts();

      // Extract the first account address
      const address = accounts[0].address;

      // Extract the private key from the serialized wallet
      const serializedWallet = await wallet.serialize();
      const privkeyHex = serializedWallet[0].privkey;
      const privkey = encodeSecp256k1PrivateKey(fromHex(privkeyHex));

      console.log("Mnemonic:", mnemonic);
      console.log("Address:", address);
      console.log("Private Key:", privkey);

      return { mnemonic, address, privkey: privkey.toString("hex") };
    };

    const walletData = await generateWallet();
    res.status(200).send(walletData);
  } catch (error) {
    console.error("Error generating wallet:", error);
    res.status(500).send({
      error: "Failed to generate wallet",
    });
  }
});

//------------Sent Transaction----------------
app.post("/sendTransaction", async (req, res) => {
  try {
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
          res.status(400).send({
            success: false,
            message:
              "Sender address does not match the derived address from mnemonic",
          });
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

        // Convert any BigInt fields to strings
        const stringifyResult = JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        );

        res.status(200).send(JSON.parse(stringifyResult));
      } catch (error) {
        console.error("Failed to send tokens:", error);
        res.status(500).send({ success: false, error: error.message });
      }
    };

    // Example usage
    const senderAddress = "ssi1hwlpamt7xd6lvj8fq2tlms7feex4uk8mms2dac"; // Replace with sender address
    const recipientAddress = "ssi109tvmsvhdw469y4pvh4amzxhads3ajc5vc9zw0"; // Replace with recipient address
    const amount = 1000; // Amount in smallest denomination (e.g., soid for ATOM)
    const mnemonic =
      "camp dirt cloth element walk laundry catch pelican ensure sniff rain embrace pole shuffle cross roast bargain vanish segment inhale adult knife city relax"; // Replace with sender's mnemonic

    sendTokens(senderAddress, recipientAddress, amount, mnemonic)
      .then(() => console.log("Transaction sent"))
      .catch((err) => console.error(err));
  } catch (error) {
    console.log("err2", error);
  }
});

// ------------FIND SEEDPHRASE THROUGH SOVID----------
app.post("/findseedPhrase", async (req, res) => {
  try {
    const { sovId, chain } = req.body;
    const data = await Newaccounts.findOne({ sovId: sovId, chain: chain });
    res.status(200).send(data.seedPhrase);
  } catch (error) {}
});

// ------------FIND ALL WALLET ADDRESS THROUGH SOVID----------
app.post("/findWalletAddress", async (req, res) => {
  try {
    const { sovId } = req.body;
    const data = await allWallet.find({ sovId: sovId });
    res.status(200).send(data);
  } catch (error) {}
});

// --------------GENERATE NEW ACCOUNT-----------
app.post("/generateNewAccount", async (req, res) => {
  try {
    const data = await generateNewWallet();
    res.status(200).send(data);
  } catch (error) {}
});

// -------------TOKENTRANSFER API-------------

app.post("/sendTokens", async (req, res) => {
  const { senderAddress, recipientAddress, amount, privateKey } = req.body;
  console.log(
    "Received request to send tokens:",
    senderAddress,
    recipientAddress,
    amount,
    privateKey
  );

  if (!senderAddress || !recipientAddress || !amount || !privateKey) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters" });
  }

  try {
    const result = await sendTokens(
      senderAddress,
      recipientAddress,
      amount * 1e6,
      privateKey
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------------------FIND PRIVATE KEY FROM WALLET------
app.post("/findPrivateKey", async (req, res) => {
  try {
    const { wallet } = req.body;
    const data = await allaccount.findOne({ wallet: wallet });
    if (data) {
      res.status(200).send(data.privateKey);
    }
  } catch (error) {}
});

// ------------------------TRANSACTION POST API---------
app.post("/saveTransaction", async (req, res) => {
  try {
    const data = new Transactions(req.body);
    await data.save();
    res.status(200).send(data);
  } catch (error) {}
});

// --------------------FETCH TRANSACTION THROUGH SOVID---
app.post("/fetchTransaction", async (req, res) => {
  try {
    const { sovId } = req.body;
    const data = await Transactions.find({ sovId: sovId });
    res.status(200).send(data.reverse());
  } catch (error) {}
});

// --------------FETCH TRANSACTION THROUGH TXHASH----------
app.post("/fetchtx", async (req, res) => {
  try {
    const { txHash } = req.body;
    const data = await Transactions.findOne({ txHash: txHash });
    res.status(200).send(data);
  } catch (error) {}
});

// -----------IMPORT PRIVATE KEY------------
app.post("/getAddress", async (req, res) => {
  const { privateKey, sovId } = req.body;

  if (!privateKey) {
    return res
      .status(400)
      .json({ error: "privateKey and prefix are required" });
  }

  try {
    const address = await getAddressFromPrivateKey(privateKey, "ssi");
    const user = await allWallet.find({ sovId: sovId });
    const data = await new allWallet({
      sovId: sovId,
      wallet: address,
      privateKey: privateKey,
      addressIndex: user.length,
    });

    await data.save();

    res.status(200).send({ address: address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to send ETHsendTokens from Wallet A to Wallet B
app.post("/send-eth", async (req, res) => {
  const { privateKeyA, walletB, amount } = req.body;

  if (!privateKeyA || !walletB || !amount) {
    return res.status(400).json({
      error: "Missing required fields: privateKeyA, walletB, or amount",
    });
  }

  try {
    const receipt = await sendEther(privateKeyA, walletB, amount);
    res.status(200).json({
      success: true,
      message: receipt.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST endpoint for verifying seed phrase
app.post("/signIn", async (req, res) => {
  const { sovId, password } = req.body;
  const data = await allWallet.find({ sovId: sovId, password: password });
  if (data) {
    res.status(200).send("true");
  } else {
    res.status(400).send("false");
  }
});

// POST ALL ACCOUNT==================
app.post("/all-account", async (req, res) => {
  try {
    const data = new allaccount(req.body);
    await data.save();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

//------API FOR CREATION WALLET---------
app.post("/create-wallet", async (req, res) => {
  try {
    const { password, username } = req.body;

    if (!password) {
      console.log("Password is missing");
      return res.status(400).json({ message: "Password is required" });
    }

    // ----------STEPS 1-----------
    const seedPhrase = bip39.generateMnemonic(128);

    //-----------STEPS 2A-------------
    const ethWallet = await createWalletFromSeed(seedPhrase, 0);

    //------------STEPS 2B------------------
    const seed = await bip39.mnemonicToSeed(seedPhrase);
    const keypair = Keypair.fromSeed(seed.slice(0, 32));
    const solanaWallet = {
      address: keypair.publicKey.toBase58(),
      privkey: bs58.encode(keypair.secretKey),
    };

    //------------STEPS 2C---------------
    const soidWallet = await generateWalletFromSeed(seedPhrase, 0);

    //------------STEPS 2D ---------------
    const btcWallet = generateBitcoinWallet(seedPhrase, 0);

    //---------STEPS 3---------------
    // const tokenAmount = 1;
    // const treasuryAddress = "ssi1yhur5rvgkkku64p344yt84ycq7tws3pnn3wgql";
    // const treasuryPrivateKey =
    //   "40fb6984f9ef8c7500474b4949fe82550d580886d0c9cd517355b419373ee5d3";
    // const sendResult = await sendTokens(
    //   treasuryAddress,
    //   soidWallet.address,
    //   tokenAmount,
    //   treasuryPrivateKey
    // );

    // if (!sendResult.success) {
    //   console.error("Error sending tokens:", sendResult.message);
    //   return res.status(500).json({
    //     message: "Error sending tokens",
    //     error: sendResult.message,
    //   });
    // }

    // //--------STEPS 4-----------------
    // try {
    //   const unjailResult = await unjailValidator(seedPhrase, username);
    //   console.log("Unjail result:", unjailResult);
    // } catch (unjailError) {
    //   console.error("Error unjailing validator:", unjailError);
    //   return res.status(500).json({
    //     message: "Error unjailing validator",
    //     error: unjailError.message,
    //   });
    // }

    //-----------step-4-------------

    const did_data = await axios.post(
      `https://mapcontroller.sovereignty.one/sov/makedid`,
      {
        hash: "7896E9044E4A2FB16052BEA2EA49B50337B2EB00140D1B8C8AA5FCEB06C6407F",
        username: username,
        owner: soidWallet.address,
      }
    );
    if (did_data.status != 200) {
      return res.status(400).send("Error : Did doesnot create.");
    }

    let AllData = {
      seedPhrase: seedPhrase,
      password: password,
      username: username,
      ETH: [
        {
          wallet: ethWallet.walletAddress,
          privateKey: ethWallet.privateKey,
          Sno: 1,
        },
      ],
      SOLANA: [
        {
          wallet: solanaWallet.address,
          privateKey: solanaWallet.privkey,
          Sno: 1,
        },
      ],
      SOID: [
        {
          wallet: soidWallet.address,
          privateKey: soidWallet.privkey,
          Sno: 1,
        },
      ],
      BTC: [
        {
          wallet: btcWallet.address,
          privateKey: btcWallet.privateKey,
          Sno: 1,
        },
      ],
    };
    console.log(AllData);
    res.status(200).send(AllData);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//----API FOR CREATE WALLET THROUGH SEEDPHRASE--------

app.post("/create-wallet-seed", async (req, res) => {
  try {
    const { seedPhrase, chain, index } = req.body;

    if (!seedPhrase) {
      console.log("Seed phrase is missing");
      return res.status(400).json({ message: "Seed phrase is required" });
    }

    if (index == undefined) {
      console.log("Index is missing");
      return res.status(400).json({ message: "Index is required" });
    }

    let walletData;
    if (chain === "ETH") {
      walletData = await createWalletFromSeed(seedPhrase, index);
    } else if (chain === "SOLANA") {
      const seed = await bip39.mnemonicToSeed(seedPhrase);
      const keypair = Keypair.fromSeed(seed.slice(0, 32));
      walletData = {
        address: keypair.publicKey.toBase58(),
        privkey: bs58.encode(keypair.secretKey),
      };
    } else if (chain === "SOID") {
      walletData = await generateWalletFromSeed(seedPhrase, index);
    } else if (chain === "BTC") {
      walletData = generateBitcoinWallet(seedPhrase, index);
    } else {
      return res.status(400).json({ message: "Unsupported chain type" });
    }

    let AllData = {
      wallet: walletData,
    };
    console.log(AllData);
    res.status(200).send(AllData);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//---------fetch-account-------------
app.post("/fetch-account", async (req, res) => {
  try {
    const { chain, sovId } = req.body;
    const data = await allaccount.find({ chain: chain, sovId: sovId });
    if (!data) {
      res.status(400).send("data not found...");
      return;
    }
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

//------------CREATE ETH WALLET FROM SEEDPHRASE-----
app.post("/generate-wallet", async (req, res) => {
  const { seedPhrase, sovId, chain = "ETH" } = req.body;

  if (!seedPhrase || !sovId) {
    return res
      .status(400)
      .json({ error: "Seed phrase, sovId, and chain are required" });
  }

  try {
    // Step 1: Find the latest account for the given sovId and chain
    const latestAccount = await allaccount.findOne({ sovId, chain }).sort({
      index: -1,
    });

    console.log("l1", latestAccount);
    // Step 2: Get the last used index and increment it
    let index = latestAccount ? parseInt(latestAccount.index) + 1 : 0; // Start from 0 if no account exists
    console.log("l2", index);
    // Step 3: Call the wallet generation function with the updated index
    const walletData = await createWalletFromSeed(seedPhrase, index);
    console.log("l3", walletData);
    // Step 4: Create and save a new account in the database
    const newAccount = new allaccount({
      sovId: sovId,
      wallet: walletData.walletAddress,
      privateKey: walletData.privateKey,
      chain: chain,
      index: index.toString(), // Store index as a string
    });
    console.log("l4", newAccount);

    await newAccount.save();

    // Step 5: Return the newly created wallet information
    res.json({
      walletAddress: walletData.walletAddress,
      privateKey: walletData.privateKey,
      sovId: sovId,
      chain: chain,
      index: index,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------
app.post("/create-solana-wallet", async (req, res) => {
  try {
    // Step 1: Fetch data from req.body
    const { sovId, chain = "SOLANA", seedPhrase } = req.body;

    // Validate inputs
    if (!sovId || !seedPhrase) {
      return res
        .status(400)
        .json({ message: "sovId and seedPhrase are required." });
    }

    // Step 2: Find the latest account to get the last index
    const lastAccount = await allaccount
      .findOne({ chain: chain, sovId: sovId })
      .sort({ index: -1 });

    // If no accounts exist, start at index 0
    const lastIndex = lastAccount ? parseInt(lastAccount.index) : 0;
    const newIndex = lastIndex + 1;

    // Step 3: Generate new wallet from seed phrase and index
    const seed = bip39.mnemonicToSeedSync(seedPhrase.trim()); // trim spaces if any
    const keyPair = deriveWallet(seed, newIndex);

    const publicKey = keyPair.publicKey.toString();
    const privateKey = bs58.encode(Buffer.from(keyPair.secretKey));

    // Step 4: Create new account entry
    const newAccount = new allaccount({
      sovId,
      wallet: publicKey,
      privateKey,
      chain,
      index: newIndex.toString(),
    });

    // Step 5: Save to database
    await newAccount.save();

    // Step 6: Return success response
    res.status(201).json({
      message: "New wallet created and saved successfully",
      data: {
        sovId,
        wallet: publicKey,
        privateKey,
        chain,
        index: newIndex,
      },
    });
  } catch (error) {
    console.error("Error creating wallet:", error.message);

    // Return a more informative error message
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

//-------------------------------
app.post("/createWallet/seeds", async (req, res) => {
  try {
    const { seedPhrase, chain, addressIndex } = req.body;
    let walletData;

    if (!seedPhrase) {
      console.log("Seed phrase is missing");
      return res.status(400).json({ message: "Seed phrase is required" });
    }

    if (addressIndex == undefined) {
      console.log("Address index is missing");
      return res.status(400).json({ message: "Address index is required" });
    }

    if (chain === "SOID") {
      walletData = await generateWalletFromSeed(seedPhrase, addressIndex);
      res.status(200).send({
        wallet: walletData.address,
        privateKey: walletData.privkey,
        Sno: addressIndex + 1,
      });
    } else if (chain === "ETH") {
      walletData = await createWalletFromSeed(seedPhrase, addressIndex);
      res.status(200).send({
        wallet: walletData.walletAddress,
        privateKey: walletData.privateKey,
        Sno: addressIndex + 1,
      });
    } else if (chain === "SOLANA") {
      walletData = await deriveWallet(seedPhrase, addressIndex);
      res.status(200).send({
        wallet: walletData.publicKey,
        privateKey: walletData.privateKey,
        Sno: addressIndex + 1,
      });
    } else if (chain === "BTC") {
      walletData = generateBitcoinWallet(seedPhrase, addressIndex);
      res.status(200).send({
        wallet: walletData.address,
        privateKey: walletData.privateKey,
        Sno: addressIndex + 1,
      });
    } else {
      return res.status(400).send({ error: "Unsupported chain" });
    }
    console.log("w3", walletData);
  } catch (error) {
    console.error("Error generating wallet:", error);
    res.status(500).send({ error: "Failed to generate wallet" });
  }
});

// -----------SEND SOL--------------
app.post("/send-sol", async (req, res) => {
  const { senderPrivateKey, recipientPublicKey, amount } = req.body;

  if (!senderPrivateKey || !recipientPublicKey || !amount) {
    return res
      .status(400)
      .send(
        "Sender private key, recipient public key, and amount are required."
      );
  }

  try {
    const result = await sendSol(senderPrivateKey, recipientPublicKey, amount);

    if (result.success) {
      res.send({
        message: "Transaction confirmed",
        signature: result.signature,
      });
    } else {
      res.status(500).send(`An error occurred: ${result.error}`);
    }
  } catch (error) {
    res.status(500).send(`Invalid private key format: ${error.message}`);
  }
});

//----------MAKE DID------------
app.post("/unjail", async (req, res) => {
  const { mnemonic, username } = req.body;

  if (!mnemonic || !username) {
    return res
      .status(400)
      .json({ message: "Mnemonic and username are required" });
  }

  try {
    const result = await unjailValidator(mnemonic, username);

    // Convert BigInt values to strings
    const resultStringified = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res
      .status(200)
      .json({ message: "Transaction successful", result: resultStringified });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  }
});

//------API FOR SIGN IN THROUGH SEEDPHRASE---------
app.post("/sign-in-seed", async (req, res) => {
  try {
    const { seedPhrase, password, username } = req.body;
    console.log("s3", seedPhrase, password, username);
    if (!seedPhrase) {
      console.log("seedPhrase is missing");
      return res.status(400).json({ message: "seedPhrase is required" });
    }

    //-----------STEPS 2A-------------
    const ethWallet = await createWalletFromSeed(seedPhrase, 0);

    //------------STEPS 2B------------------
    const seed = await bip39.mnemonicToSeed(seedPhrase);
    const keypair = Keypair.fromSeed(seed.slice(0, 32));
    const solanaWallet = {
      address: keypair.publicKey.toBase58(),
      privkey: bs58.encode(keypair.secretKey),
    };

    //------------STEPS 2C---------------
    const soidWallet = await generateWalletFromSeed(seedPhrase, 0);

    let AllData = {
      seedPhrase: seedPhrase,
      password: password,
      username: username,
      ETH: [
        {
          wallet: ethWallet.walletAddress,
          privateKey: ethWallet.privateKey,
          Sno: 1,
        },
      ],
      SOLANA: [
        {
          wallet: solanaWallet.address,
          privateKey: solanaWallet.privkey,
          Sno: 1,
        },
      ],
      SOID: [
        {
          wallet: soidWallet.address,
          privateKey: soidWallet.privkey,
          Sno: 1,
        },
      ],
    };
    console.log(AllData);
    res.status(200).send(AllData);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//-----------OCR API---------------
const upload = multer({ dest: "uploads/" });

// Endpoint to handle image uploads and perform OCR
app.post("/ocr", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = req.file.path;

  Tesseract.recognize(imagePath, "eng", {
    logger: (info) => console.log(info), // Log progress
  })
    .then(({ data: { text } }) => {
      res.json({ text });
      fs.unlinkSync(imagePath); // Delete the file after processing
    })
    .catch((error) => {
      console.error("Error during OCR processing:", error);
      res
        .status(500)
        .json({ error: "OCR processing failed", details: error.message });
      fs.unlinkSync(imagePath); // Delete the file in case of error
    });
});

//-----------GMAIL-----------------
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

app.post("/send-email", async (req, res) => {
  const { to, from, subject, text, html, hvi, sovId } = req.body;

  try {
    // Save HVI data to MongoDB
    const newHvi = new Hvi({ hvi, sovId, gmail: to });
    await newHvi.save();

    // Send email using Sendinblue
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = { email: from };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.htmlContent = html;

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log(
          "Email sent successfully. Returned data: " + JSON.stringify(data)
        );
        res.status(200).send("HVI data saved and email sent successfully");
      },
      function (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      }
    );
  } catch (error) {
    console.error("Error saving HVI data:", error);
    res.status(500).send("Error saving HVI data");
  }
});

//------------FETCH HVI THROUGH SOVID----------
app.post("/fetch-hvi", async (req, res) => {
  try {
    const { hvi } = req.body;
    const data = await Hvi.find({ hvi: hvi });
    if (!data) {
      res.status(400).send("User doesnot exist...");
    }
    res.status(200).send(data[0].sovId);
  } catch (error) {
    res.status(500).send(error);
  }
});

//-------- API endpoint to send Bitcoin
app.post("/send-bitcoin", async (req, res) => {
  const { fromAddress, toAddress, amountSatoshis, privateKeyWIF } = req.body;

  if (!fromAddress || !toAddress || !amountSatoshis || !privateKeyWIF) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const transactionId = await sendBitcoin({
      fromAddress,
      toAddress,
      amountSatoshis,
      privateKeyWIF,
    });
    res.status(200).json({ transactionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Connection is listen at http://localhost:${port}`);
});
