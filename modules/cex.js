const request = require('request');
const _ = require('lodash');
const util = require('./utils.js');
const Model = require('./model.js');

const uri = {
  fetch: 'https://cex.io/api/tickers/USD'
}
let btc2usd = '';

const filter = [
  'BTC:USD',  // BTC
  'ETH:USD',  // ETH
  'BCH:USD',  // BCH
  'DASH:USD', // DAS
  'XRP:USD',  // XRP
]

function parser(data) {
  const result = new Model();
  if (!data) return result;

  result.name = util.nameConverter(data.name);
  result.last_price = data.last * global.THB;
  result.last_price_usd = data.last;

  return result;
}

function fetch(callback) {
  callback = callback || function(){};
  const val = []
  request(uri.fetch, function (err, resp) {
    if (!err && resp.body[0] !== '<') {
      const data = JSON.parse(resp.body);
      const coins = _.filter(data.data, function(coin) {
        return _.indexOf(filter, coin.pair) > -1;
      })

      _.each(coins, function(obj) {
        obj.name = (obj.pair).split(':')[0];
        val.push(parser(obj));
      })
      
      callback(val);
    } else {
      console.log('error:', err);
    }
  });
}


module.exports = {
  fetch
}
