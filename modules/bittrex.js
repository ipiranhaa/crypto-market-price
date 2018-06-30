const request = require('request');
const _ = require('lodash');
const util = require('./utils.js');
const Model = require('./model.js');

const url = "https://bittrex.com/api/v1.1/public"
const filter = [
  'USDT-BTC',   // BTC
  'USDT-ETH',   // ETH
  'USDT-NEO',   // NEO
  'USDT-OMG',   // OMG
  'USDT-XRP',   // XRP
  'USDT-BCH',   // BCH
  'USDT-DASH',  // DAS
  'USDT-LTC',   // LTC
  'BTC-XZC'     // XZC
];
const currency = 'usd'
let btc2usd = '';

function parser(data, srcCurrency) {
  const result = new Model();
  if (!data) return result;

  result.name = util.nameConverter(data.name);
  if (srcCurrency === 'USDT') {
    if (result.name === 'BTC') {
      btc2usd = data.Last;
    }
    result.last_price = data.Last * global.THB;
    result.last_price_usd = data.Last;
  } else {
    result.last_price = (data.Last * btc2usd) * global.THB;
    result.last_price_usd = data.Last * btc2usd;
  }
  
  return result;
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
        const splitedName = symbol.split('-');
        body.result.name = splitedName[1];
        callback(body.result, splitedName[0])
       }
    }
  });
}

function fetch(callback) {
  callback = callback || function(){};
  const val = [];
  _.each(filter, function(symbol) {
    get(symbol, function(data, srcCurrency) {
      if (data) {
        val.push(parser(data, srcCurrency));
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
