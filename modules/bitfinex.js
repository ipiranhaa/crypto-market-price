const request = require('request');
const _ = require('lodash');
const util = require('./utils.js');

const url = "https://api.bitfinex.com/v1"
const filter = [
  'btcusd', // BTC
  'ethusd', // ETH
  'omgusd', // OMG
  'xrpusd', // XRP
  'bchusd'  // BCH
];
const currency = 'usd'

function parser(data) {
  return {
    name: util.nameConverter(data.name),
    last_price: data.last_price * global.THB,
    currency: 'THB',
    change: null,
    volume: data.volume
  }
}

function get(symbol, callback) {
  callback = callback || function(){};
  request.get(url + "/pubticker/" + symbol,
    function(err, resp, body) {
    if (!err && resp.body[0] !== '<') {
      body = JSON.parse(body);
      body.name = symbol.split(currency)[0].toUpperCase();
      callback(body)
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
