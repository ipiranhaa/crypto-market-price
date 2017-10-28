const request = require('request');
const _ = require('lodash');

const url = 'https://www.binance.com/api/v1';
let btc2usd = '';

const filter = [
  'BTCUSDT',  // BTC
  'ETHUSDT', // ETH
  'OMGBTC', // OMG
  // 'XRPBTC', // XRP
  'EVXBTC'  // EVX
]

function parser(data) {
  const result = {
    last_price: data.last_price,
    currency: data.primary_currency,
    change: data.change,
    volume: data.volume_24hours
  }

  const srcCurrency = (data.symbol).slice(3);
  result.name = (data.symbol).slice(0, 3);

  if (srcCurrency === 'USDT') {
    if (result.name === 'BTC') {
      btc2usd = data.price;
    }
    result.last_price = data.price * global.THB;
  } else {
    result.last_price = (data.price * btc2usd) * global.THB;    
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
