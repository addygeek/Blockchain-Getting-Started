const EC = require("elliptic").ec,
  ec = new EC("secp256k1");

const Aditya_PrivateKey= "62d101759086c306848a0c1020922a78e8402e1330981afe9404d0ecc0a4be3d";
console.log(Aditya_PrivateKey)
const Aditya_Key_pair = ec.keyFromPrivate(Aditya_PrivateKey, 'hex');
console.log(Aditya_Key_pair)
module.exports = {
    Aditya_Key: Aditya_Key_pair
}