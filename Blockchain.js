// Importing Crypto Library
const crypto = require("crypto");

// Creating a function to calculate the SHA256 hash of a message
SHA256 = (message) => crypto.createHash("sha256").update(message).digest("hex");

// Importing Elliptic for wallet creation
const EC = require("elliptic").ec,
  ec = new EC("secp256k1");

// Configuring the MINT WALLET
const MINT_WALLET = ec.genKeyPair();
const MINT_PUBLIC_ADDRESS = MINT_WALLET.getPublic("hex");
const MINT_PRIVATE_ADDRESS = MINT_WALLET.getPrivate("hex");

class Block {
  constructor(data = []) {
    this.timestamp = Date.now();
    this.data = data;
    this.hash = this.getHash();
    this.prevHash = "";
    this.nonce = 0;
  }

  getHash() {
    return SHA256(
      this.timestamp + this.prevHash + JSON.stringify(this.data) + this.nonce
    );
  }

  mine(difficulty) {
    while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
      this.nonce++;
      this.hash = this.getHash();
    }
  }

  // Checks if the transactions in the block are valid
  hasValidTransactions(chain) {
    for (const tx of this.data) {
      if (tx.constructor.name === "Transaction") {
        if (!tx.isValid(tx, chain)) {
          return false;
        }
      } else {
        return false; // Invalid if not a Transaction instance
      }
    }
    return true;
  }
}

class Blockchain {
  constructor() {
    const initialCoinRelease = new Transaction(
      MINT_PUBLIC_ADDRESS,
      ADITYA_WALLET.getPublic("hex"),
      1000
    );
    this.chain = [new Block([initialCoinRelease])];
    this.difficulty = 2;
    this.blockTime = 5000;
    this.Transaction = [];
    this.reward = 10;
  }

  // Retrieve the last added block
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Adding block to blockchain
  addBlock(block) {
    block.prevHash = this.getLastBlock().hash;
    block.mine(this.difficulty);
    this.chain.push(block);
    this.difficulty +=
      Date.now() - this.getLastBlock().timestamp < this.blockTime ? 1 : -1;
  }

  // Check the validity of the blockchain
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentblock = this.chain[i];
      const prevBlock = this.chain[i - 1];
      if (
        currentblock.hash !== currentblock.getHash() ||
        currentblock.prevHash !== prevBlock.hash ||
        !currentblock.hasValidTransactions(this)
      ) {
        return false;
      }
    }
    return true;
  }

  // Adding transaction to the blockchain
  addTransaction(transaction) {
    if (transaction.isValid(transaction, this)) {
      this.Transaction.push(transaction);
    }
  }

  // Minting new coins as reward to miners
  mineTransaction(rewardAddress) {
    let gas = 0;
    this.Transaction.forEach((tx) => {
      gas += tx.gas;
    });
    const rewardTransaction = new Transaction(
      MINT_PUBLIC_ADDRESS,
      rewardAddress,
      this.reward + gas
    );
    if (this.Transaction.length !== 0) {
      this.addBlock(new Block([rewardTransaction, ...this.Transaction]));
    }
    this.Transaction = [];
  }

  // Check the balance of a particular user
  getBalance(address) {
    let balance = 0;
    this.chain.forEach((block) => {
      block.data.forEach((transaction) => {
        if (transaction.from === address) {
          balance -= transaction.amount;
          balance -= transaction.gas;
        }
        if (transaction.to === address) {
          balance += transaction.amount;
        }
      });
    });
    return balance;
  }
}

class Transaction {
  constructor(from, to, amount, gas = 0) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.gas = gas;
  }

  sign(keyPair) {
    // Check if the keyPair is the sender of the transaction
    if (keyPair.getPublic("hex") === this.from) {
      // Approve the transaction is signed by the original initiator
      this.signature = keyPair
        .sign(SHA256(this.from + this.to + this.amount + this.gas))
        .toDER("hex");
    }
  }

  isValid(tx, chain) {
    return (
      tx.from &&
      tx.to &&
      tx.amount &&
      chain.getBalance(tx.from) >= tx.amount + tx.gas &&
      ec
        .keyFromPublic(tx.from, "hex")
        .verify(SHA256(tx.from + tx.to + tx.amount + tx.gas), tx.signature)
    );
  }
}

// Check the Wallet
console.log("Public: ", MINT_PUBLIC_ADDRESS);
console.log("Private: ", MINT_PRIVATE_ADDRESS);
// OUTPUT:-
// Public:  04e43a39f6efd7e4791abb347da764cc36f0a926a10cb011d5e9e4d0666459cd1255e9c19bae9dbdadd18baaba68bf2ed7898d36710118b8fb4201c40bd244fb9f
// Private:  841decaf4649cb047d7d20f991d034908f92e4ea073cf71597cf051c1fa65261
// NOTE:- In real life on Block-chain never reveal your private key to anyone else you lose your crypto

// Lets now create wallets to send and receive the amount
const ADITYA_WALLET = ec.genKeyPair();
const RECRUTER_WALLET = ec.genKeyPair();
const MINER_WALLET = ec.genKeyPair();
const ANURAG_WALLET = ec.genKeyPair();

// Now create the blockchain of coin name below
const SathoshiCoin = new Blockchain();

// Let's do the transaction on blockchain
const transaction1 = new Transaction(
  ADITYA_WALLET.getPublic("hex"),
  RECRUTER_WALLET.getPublic("hex"),
  200,
  20
);
transaction1.sign(ADITYA_WALLET);
SathoshiCoin.addTransaction(transaction1);
SathoshiCoin.mineTransaction(MINER_WALLET.getPublic("hex"));

// Let's do another transaction on blockchain
const transaction2 = new Transaction(
  RECRUTER_WALLET.getPublic("hex"),
  ANURAG_WALLET.getPublic("hex"),
  100,
  10
);
transaction2.sign(RECRUTER_WALLET);
SathoshiCoin.addTransaction(transaction2);
SathoshiCoin.mineTransaction(MINER_WALLET.getPublic("hex"));

// Let's check the SathoshiCoin
console.log(SathoshiCoin.chain);
console.log(
  "Aditya Remaining Coin Balance : for address of : ",
  ADITYA_WALLET.getPublic("hex"),
  SathoshiCoin.getBalance(ADITYA_WALLET.getPublic("hex"))
);
console.log(
  "RECRUTER_WALLET Coin Balance : for address of : ",
  RECRUTER_WALLET.getPublic("hex"),
  SathoshiCoin.getBalance(RECRUTER_WALLET.getPublic("hex"))
);
console.log(
  "ANURAG_WALLET Coin Balance : for address of : ",
  ANURAG_WALLET.getPublic("hex"),
  SathoshiCoin.getBalance(ANURAG_WALLET.getPublic("hex"))
);
console.log(
  "MINER_WALLET Coin Balance : for address of : ",
  MINER_WALLET.getPublic("hex"),
  SathoshiCoin.getBalance(MINER_WALLET.getPublic("hex"))
);
