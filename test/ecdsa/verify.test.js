var  ethereum = require('../../');

var util = ethereum.util;
var ec = ethereum.ecdsa;
var conv = ethereum.convert;

var priv = util.bigIntFromHex(util.sha3('private key brainiac'));
var msg = conv.hexToBytes(util.sha3('this is a message to sign'));


sig = ec.sign(msg, priv);

pub = ec.recoverPubKey(sig, msg);

var t = sig[0],
    r = sig[1],
    s = sig[2];

var re  = ec.verify(sig, msg, pub, console); 
console.log('signature verified: '+re);

