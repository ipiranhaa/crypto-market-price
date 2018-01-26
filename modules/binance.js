const request = require('request');
const _ = require('lodash');
const util = require('./utils.js');
const Model = require('./model.js');

const url = 'https://www.binance.com/api/v1';
let btc2usd = '';

const filter = [
  'BTCUSDT',  // BTC
  'ETHUSDT',  // ETH
  'OMGBTC',   // OMG
  'XRPBTC',   // XRP
  'EVXBTC',   // EVX
  'BCCBTC',   // BCH
  'LTCUSDT',  // LTC
  'DASHBTC',  // DAS
  'XZCBTC',   // XZC
]

function parser(data) {
  const result = new Model();
  if (!data) return result;

  const srcCurrency = (data.symbol).slice(3);
  result.name = util.nameConverter((data.symbol).slice(0, 3));

  if (srcCurrency === 'USDT') {
    if (result.name === 'BTC') {
      btc2usd = data.price;
    }
    result.last_price = data.price * global.THB;
    result.last_price_usd = data.price;
  } else {
    result.last_price = (data.price * btc2usd) * global.THB;    
    result.last_price_usd = data.price * btc2usd;
  }

  return result;
}

function fetch(callback) {
  callback = callback || function(){};
  const val = []
  request(url + '/ticker/allPrices', function (err, resp) {
    if (!err && resp.body[0] !== '<') {
      const data = JSON.parse(resp.body);
      const filteredData = _.filter(data, function(coin) {
        return _.indexOf(filter, coin.symbol) > -1 && coin;
      })

      _.each(filteredData, function(data) {
        val.push(parser(data));
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
