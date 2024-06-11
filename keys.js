const EC = require("elliptic").ec,
  ec = new EC("secp256k1");

const Aditya_PrivateKey= "62d101759086c306848a0c1020922a78e8402e1330981afe9404d0ecc0a4be3d";
//console.log(Aditya_PrivateKey)
const Aditya_Key_pair = ec.keyFromPrivate(Aditya_PrivateKey, 'hex');
//console.log(Aditya_Key_pair)

const Miner_Private_Key = "33f201809376d407959b1d2030933b89f9503f2441a92bf0505e0fdd1b5cf4e"
const MINER_KEY_PAIR = ec.keyFromPrivate(Miner_Private_Key,'hex');
module.exports = {
    Aditya_Key: Aditya_Key_pair,
    MINER_KEY : MINER_KEY_PAIR
}


// MINT_PRIVATE_KEY: "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e"

// Miner_Private_Key: "33f201809376d407959b1d2030933b89f9503f2441a92bf0505e0fdd1b5cf4e"

// John_Private_Key: "62d101759086c306848a0c1020922a78e8402e1330981afe9404d0ecc0a4be3d"

// Jenifer_Private_Key: "12a301658495b205738z09101812w67d7301f122087z9ef8303c0dbbz9ad2c"

// Bob_Private_Ket: "15e301468795b406849g0d1030915f86e8503g132098fbfg505d0edd0b4cf3d"

