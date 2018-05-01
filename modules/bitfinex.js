const request = require('request');
const _ = require('lodash');
const util = require('./utils.js');
const Model = require('./model.js');

const url = "https://api.bitfinex.com/v1"
const filter = [
  'btcusd', // BTC
  'ethusd', // ETH
  'neousd', // NEO
  'omgusd', // OMG
  'xrpusd', // XRP
  'bchusd', // BCH
  'dshusd', // DAS
  'ltcusd', // LTC
  // 'xzcusd' // XZC
];
const currency = 'usd'

function parser(data) {
  const result = new Model();
  if (!data) return result;

  result.name = util.nameConverter(data.name);
  result.last_price = data.last_price * global.THB;
  result.last_price_usd = data.last_price;
  result.volume = data.volume;

  return result;
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
