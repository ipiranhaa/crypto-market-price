const request = require('request');
const _ = require('lodash');
const Model = require('./model.js');

const url = 'https://api.coinmarketcap.com/v1/ticker/';

const filter = [
  'BTC',
  'ETH',
  'OMG',
  'XRP',
  'BCH',
  'EVX',
  'DAS',
  'LTC',
  'XZC'
]

const symbols = [
  'bitcoin',
  'ethereum',
  'omisego',
  'ripple',
  'bitcoin-cash',
  'everex',
  'dash',
  'litecoin',
  'zcoin'
]

function parser(data) {
  const result = new Model();
  if (!data) return result;

  result.name = data.symbol.length > 3 ? (data.symbol).slice(0, 3) : data.symbol;
  result.last_price = data.price_thb;
  result.last_price_usd = data.price_usd;
  result.volume = data['24h_volume_thb'];
  result.change = data.percent_change_24h;

  return result;
}

function get(symbol, callback) {
  callback = callback || function(){};
  const uri = url + symbol + "/?convert=THB";
  request.get(uri,
    function(err, resp, body) {
      if (!err && resp.body[0] !== '<') {
      body = JSON.parse(body);
      if (body[0]) {
        callback(body[0]);
       }
    }
  });
}

function fetch(callback) {
  callback = callback || function(){};
  const val = [];
  _.each(symbols, function(symbol, i) {
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
