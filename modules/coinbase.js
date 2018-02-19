const request = require('request');
const _ = require('lodash');
const Model = require('./model.js');

const url = "https://api.coinbase.com/v2"
const filter = [
  'btc-usd', // BTC
  'eth-usd', // ETH
  'bch-usd', // BCH
  'ltc-usd'  // LTC
];
const currency = 'usd'

function parser(data) {
  const result = new Model();
  if (!data) return result;

  result.name = data.base;
  result.last_price = data.amount * global.THB;
  result.last_price_usd = data.amount;

  return result;
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
