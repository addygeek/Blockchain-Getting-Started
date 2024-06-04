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
        return this.data.every(transaction => transaction.isValid(transaction,chain));
    }


}


// Now lets test it
const block1 = new Block(['Transaction 1']);
console.log(block1);
block1.mine(4);
console.log(block1);
// Lets build the block-chain

class Blockchain {
    constructor()
    {
        this.chain= [new Block(['Genesis Block'])];
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
    {   const rewardTransaction = new Transaction(MINT_PUBLIC_ADDRESS,rewardAddress,this.reward);
        this.addBlock(new Block([rewardTransaction,...this.Transaction]));
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

//Lets now make a Blockchain on my name and then add the transcation mannually
const ADDYCOIN = new Blockchain();
ADDYCOIN.addBlock(new Block(['Transaction 1']));
ADDYCOIN.addBlock(new Block(['Transaction 2']));
ADDYCOIN.addBlock(new Block(['Transaction 3']));
ADDYCOIN.addBlock(new Block(['Transaction 4']));

//after adding lets check the output of transcations
console.log(ADDYCOIN.chain);
// OUTPUT:>
// Block {
//     timestamp: 1717436826797,
//     data: [ 'Transaction 1' ],
//     hash: '00148dcb64d5298c3e247a61d687b283c7e192332a87e353eed074577c52deaa',
//     prevHash: '8d17cbd3497d110ed84820db9c923bebc4b4ede3235e9731b95c665bb25e77a8',
//     nonce: 92
//   },
//   Block {
//     timestamp: 1717436826798,
//     data: [ 'Transaction 2' ],
//     hash: '0003e59a1b20326176f2562679968a1f57a6f5e5a06713ed57afe96ccf26d37e',    
//     prevHash: '00148dcb64d5298c3e247a61d687b283c7e192332a87e353eed074577c52deaa',
//     nonce: 10889
//   },
//   Block {
//     timestamp: 1717436826823,
//     data: [ 'Transaction 3' ],
//     hash: '00008089787bb1d611bce4528113a507cb7d01d9de8d365327053202e6f2c5d5',    
//     prevHash: '0003e59a1b20326176f2562679968a1f57a6f5e5a06713ed57afe96ccf26d37e',
//     nonce: 101162
//   },
//   Block {
//     timestamp: 1717436827068,
//     data: [ 'Transaction 4' ],
//     hash: '0000024e6708a47aa647e662b04e7811f4e5d75eb6a050f76ec20810ce2d3bcf',    
//     prevHash: '00008089787bb1d611bce4528113a507cb7d01d9de8d365327053202e6f2c5d5',
//     nonce: 3260692
//   }

console.log("Is ADDY Coin valid?", ADDYCOIN.isValid());
//Is ADDY Coin valid? true

//Now lets try to temper the already created block-chain this will make it confirm why is the data on blockchain tempering is allmost impossible

ADDYCOIN.chain[1].data= "This is hacked"
console.log(ADDYCOIN.chain);
console.log(ADDYCOIN.isValid());


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
            ec.keyFromPublic(tx.from,'hex').verify(SHA256(tx.from + tx.top+  tx.amount), tx.signature)
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
//Output:- 
//     Block {
//         timestamp: 1717523270316,
//         data: [ 'Genesis Block' ],
//         hash: '8d17cbd3497d110ed84820db9c923bebc4b4ede3235e9731b95c665bb25e77a8',
//         prevHash: '',
//         nonce: 0
//       },
//       Block {
//         timestamp: 1717523270371,
//         data: [ [Transaction], [Transaction] ],
//         hash: '0096ac8e84ed471ecbdb7ba9dd3cecbb53792bb6481f5c48f668987cb91dd0d9',
//         prevHash: '8d17cbd3497d110ed84820db9c923bebc4b4ede3235e9731b95c665bb25e77a8',
//         nonce: 663
//       }
//     ]
//let study what those transactions in data are ;
console.log(SathoshiCoin.chain[1].data[1]);
// Below here the from is address of ADITYA_WALLET and then to is the RECUTOR WALLET and amount of coin trasfer
//console.log(ADITYA_WALLET.getPublic('hex'));
// from: '04387c1dcb5ba3fda8bc5bf750c04d0c7d82c2ff74d653fe7f1fd7e312a2df30926b5c3b3fd3f4bc5046622873eaa26eae8f53882d850d0473f1017ac266ef57a7',
//   to: '041fa35db437c848318a66de6fb81bce260c0672a498dbe32bf9667331adeeaee11b9467446cb5970d08610e5836d632d3e6f383730cddd26192af5b90dadcee43',
//   amount: 100,
//   signature: '3045022100eb25919bbbc253110557eebdfceb12e5a9bb48ed4f4d5969bbe415d66820d07702201d12566f7c2072a7617eb932ecf18fe94f48ee40deb78208dd87b07f53ea011c'

// There are some fundamental problems here, here aditya is sending the 100 coins to Recutor but Aditya dont have any coin so lets build that here to have coins 

// now created a getBalance method in Blockchain that will do all these 