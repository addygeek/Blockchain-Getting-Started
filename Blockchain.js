//Starting with importing Crypto Library 
const crypto = require('crypto');
//Creating a function to calculate the SHA256 hash of a message
SHA256 = message => crypto.createHash('sha256').update(message).digest('hex');

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
            if(currentblock.hash !== currentblock.getHash() || currentblock.prevHash !== prevBlock.hash)
            {
                return false;
            }
        }
        return true;
    }

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
