//Starting with importing Crypto Library 
const crypto = require('crypto');
//Creating a function to calculate the SHA256 hash of a message
SHA256 = message => crypto.createHash('sha256').update(message).digest('hex');

//importing Elliptic  for wallet creating 
const EC = require('elliptic').ec, ec = new EC('secp256k1');
//Lets configure the WALLET
const MINT_WALLET = ec.genKeyPair();

const MINT_PUBLIC_ADDRESS = MINT_WALLET.getPublic('hex');
const MINT_PRIVATE_ADDRESS = MINT_WALLET.getPrivate('hex');

class Block {
    constructor(data= [])
    {
        this.timestamp = Date.now();
        this.data = data;
        this.hash= this.getHash();
        this.prevHash = '';
        this.nonce = 0;
    }
    getHash()
    {
        return SHA256(this.timestamp + this.prevHash + JSON.stringify(this.data) + this.nonce);
    }
    mine(difficulty)
    {
        while(!this.hash.startsWith(Array(difficulty + 1).join("0")))
        {
            this.nonce++;
            this.hash = this.getHash();
        }
    }
    //it checks the recent transcation performed was valid or not
    hasValidTransactions (chain)
    {
        for (const tx of this.data) {
          if (tx.constructor.name === "Transaction") { // Check if it's a Transaction object
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
    constructor()
    {
        const initialCoinRelease = new Transaction(MINT_PUBLIC_ADDRESS,ADITYA_WALLET.getPublic('hex'),1000);
        this.chain= [new Block([initialCoinRelease])];
        this.difficulty= 2;
        this.blockTime =5000;
        this.Transaction = [];
        this.reward = 10;
    }
    //retrive the last added block where next block will get linked as previous block
    getLastBlock()
    {
        return this.chain[this.chain.length - 1];
    }

    //adding block to blockchain with it
    addBlock(block)
    {
        block.prevHash= this.getLastBlock().hash;
        block.mine(this.difficulty);

        this.chain.push(block);
        this.difficulty += Date.now() - this.getLastBlock().timestamp< this.blockTime? 1: -1;
    }
    // TO check there is no temparing happened 
    isValid()
    {
        for(let i=1; i<this.chain.length; i++)
        {
            const currentblock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currentblock.hash !== currentblock.getHash() || 
            currentblock.prevHash !== prevBlock.hash ||
            !currentblock.hasValidTransactions(this)){
                return false;
            }
        
            {
                return false;
            }
        }
        return true;
    }
    //transcationg adding in blockchain
    addTransaction(transaction)
    {
        if(transaction.isValid(transaction,this))
            {
                this.Transaction.push(transaction);
            }
        
    }
    //minting is like printing new coins as reward to miners
    mineTransaction(rewardAddress)
    {   
        const rewardTransaction = new Transaction(MINT_PUBLIC_ADDRESS,rewardAddress,this.reward);
        if(this.Transaction.length!==0)
            {
                this.addBlock(new Block([rewardTransaction,...this.Transaction]));
            }
        this.transaction=[];

    }

    //Adding the feature of see the balance of particular user & block
    getBalance(address)
    {
     let balance= 0;
     
     this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if(transaction.from === address)
                {
                    balance -= transaction.amount;
                }
                if(transaction.to === address)
                {
                    balance += transaction.amount;
                }
            });
     })
     return balance;

    }
}

class Transaction{
    constructor(from, to, amount)
    {
        this.from= from;
        this.to= to;
        this.amount= amount;
    }
    sign(keyPair)
    {
        //Check if the keyPair is the sender of the transaction
        if(keyPair.getPublic('hex') === this.from)
        {
            //it approve the transaction is sign by original iniciator
            this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount)).toDER('hex');
        }
    }
    isValid(tx,chain)
    {
        return (
            tx.from &&
            tx.to &&
            tx.amount &&
            chain.getBalance(tx.from)>= tx.amount &&
            ec.keyFromPublic(tx.from,'hex').verify(SHA256(tx.from + tx.to+  tx.amount), tx.signature)
        )
    }
}

//check the Wallet
console.log("Public: ",MINT_PUBLIC_ADDRESS);
console.log("Private: ",MINT_PRIVATE_ADDRESS);
//OUTPUT:- 
//Public:  04e43a39f6efd7e4791abb347da764cc36f0a926a10cb011d5e9e4d0666459cd1255e9c19bae9dbdadd18baaba68bf2ed7898d36710118b8fb4201c40bd244fb9f
//Private:  841decaf4649cb047d7d20f991d034908f92e4ea073cf71597cf051c1fa65261
// NOTE:- In real lie on Block-chain never reveal your private key to anyone else you lose your crypto


//Lets now Create Wallet to send and recieve the amount

const ADITYA_WALLET = ec.genKeyPair();
const RECRUTER_WALLET = ec.genKeyPair();
const MINER_WALLET = ec.genKeyPair();
//Now created the blockchain of coin name below
const SathoshiCoin = new Blockchain();

//Lets do the transaction on blockchain
const transaction = new Transaction(ADITYA_WALLET.getPublic('hex'), RECRUTER_WALLET.getPublic('hex'), 100);
transaction.sign(ADITYA_WALLET);
SathoshiCoin.addTransaction(transaction);
SathoshiCoin.mineTransaction(MINER_WALLET.getPublic('hex'));

//lts check the SathoshiCoin
console.log(SathoshiCoin.chain);
console.log(SathoshiCoin.chain[0].data[0]);

console.log('Aditya Coin Balance : ', SathoshiCoin.getBalance(ADITYA_WALLET.getPublic('hex')));