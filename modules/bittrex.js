const request = require('request');
const _ = require('lodash');
const util = require('./utils.js');

const url = "https://bittrex.com/api/v1.1/public"
const filter = [
  'USDT-BTC',   // BTC
  'USDT-ETH',   // ETH
  'USDT-OMG',   // OMG
  'USDT-XRP',   // XRP
  'USDT-BCC',   // BCH
  'USDT-DASH',  // DAS
  'USDT-LTC',   // LTC
  // 'USDT-XZC',   // XZC
];
const currency = 'usd'

function parser(data) {
  if (!data) return global.schema;
  return {
    name: util.nameConverter(data.name),
    last_price: data.Last * global.THB,
    last_price_usd: data.Last,
    currency: 'THB',
    change: null,
    volume: null
  }
}

function get(symbol, callback) {
  callback = callback || function(){};
  const uri = url + "/getticker?market=" + symbol;
  request.get(uri,
    function(err, resp, body) {
      if (!err && resp.body[0] !== '<') {
      body = JSON.parse(body);
      if (body.success) {
        if (!body.result) {
          body.result = {};
        }
        body.result.name = symbol.split('USDT-')[1];
        callback(body.result)
       }
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
