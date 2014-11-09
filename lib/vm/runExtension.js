const crypto = require('crypto'),
  bignum = require('bignum'),
  ecdsaOps = require('../ecdsaOps'),
  utils = require('../utils'),
  ERROR = require('./constants.js').ERROR;

const GAS_COST = {
  1: 500,
  2: 100,
  3: 100
};

/**
 * Runs extensions
 * @param  {Object} opts [description]
 * @return {Object|Boolean}      a results object or false
 */
module.exports = function(opts) {
  var results = {},
    gasCost,
    to = bignum.fromBuffer(opts.to),
    data,
    sha256,
    ripemd160,
    msgHash, v, r, s, publicKey,
    hashStr;

  if (to.gt(3)) {
    return false;
  }

  gasCost = GAS_COST[to];
  results.gasUsed = gasCost;
  if (opts.gas.lt(gasCost)) {
    results.exception = ERROR.OUT_OF_GAS;
    return results;
  }

  if (to.eq(1)) {
    data = opts.data;
    msgHash = data.slice(0, 32);
    v = data.slice(32, 64);
    r = data.slice(64, 96);
    s = data.slice(96, 128);
    publicKey = ecdsaOps.ecrecover(msgHash, v, r, s);
    results.returnValue = utils.pad256(utils.pubToAddress(publicKey));
  }
  else if (to.eq(2)) {
    sha256 = crypto.createHash('SHA256');
    data = opts.data.toString('hex');
    hashStr = sha256.update(data).digest('hex');
    results.returnValue = new Buffer(hashStr, 'hex');
  }
  else if (to.eq(3)) {
    ripemd160 = crypto.createHash('RSA-RIPEMD160');
    data = opts.data.toString('hex');
    hashStr = utils.pad256(ripemd160.update(data).digest('bin')); // nb: bin
    results.returnValue = new Buffer(hashStr, 'hex');
  }

  return results;
};
