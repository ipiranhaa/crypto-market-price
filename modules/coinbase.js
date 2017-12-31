const request = require('request');
const _ = require('lodash');

const url = "https://api.coinbase.com/v2"
const filter = [
  'btc-usd', // BTC
  'eth-usd', // ETH
  // 'omg-usd', // OMG
  // 'xrp-usd'  // XRP
];
const currency = 'usd'

function parser(data) {
  if (!data) return global.schema;
  return {
    name: data.base,
    last_price: data.amount * global.THB,
    last_price_usd: data.amount,
    currency: 'THB',
    change: null,
    volume: null
  }
}

function get(symbol, callback) {
  callback = callback || function(){};
  const uri = url + "/prices/" + symbol.toUpperCase() + '/spot';
  request.get(uri,
    function(err, resp, body) {
    if (!err && resp.body[0] !== '<') {
      body = JSON.parse(body);
      callback(body.data)
    }
  });
}

function fetch(callback) {
  callback = callback || function(){};
  const val = [];
  _.each(filter, function(symbol) {
    get(symbol, function(data) {
      if (data) {
        val.push(parser(data));
      }

      if (val.length === filter.length) {
        callback(val);
      }
    });
  })
}

module.exports = {
  fetch
}
