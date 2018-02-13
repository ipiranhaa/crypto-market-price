const request = require('request');
const _ = require('lodash');
const util = require('./utils.js');
const Model = require('./model.js');

const uri = {
  fetch: 'https://api.gdax.com/products'
}
let btc2usd = '';

const filter = [
  'BTC-USD',  // BTC
  'ETH-USD',  // ETH
  'BCH-USD',  // BCH
  'LTC-USD',  // LTC
]

function parser(data) {
  const result = new Model();
  if (!data) return result;

  result.name = data.name;
  result.last_price = data.price * global.THB;
  result.last_price_usd = data.price;
  result.volume = data.volume;

  return result;
}

function get(symbol, callback) {
  callback = callback || function () { };
  const options = {
    url: uri.fetch + '/' + symbol + '/ticker',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    }
  }
  request.get(options, function (err, resp, body) {
    if (!err && resp.body[0] !== '<') {
      body = JSON.parse(body);
      body.name = symbol.split('-')[0];
      callback(body)
    }
  });
}

function fetch(callback) {
  callback = callback || function () { };
  const val = [];
  _.each(filter, function (symbol) {
    get(symbol, function (data) {
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
