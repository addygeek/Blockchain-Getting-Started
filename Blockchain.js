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
