const request = require('request');
const _ = require('lodash');

const uri = {
  fetch: 'https://api.coinmarketcap.com/v1/ticker/?convert=THB'
}

const filter = [
  'BTC',
  'ETH',
  'OMG',
  'XRP',
  'BCH',
  'EVX'
]

function parser(data) {
  return {
    name: data.symbol,
    last_price: data.price_thb,
    last_price_usd: data.price_usd,
    change: data.percent_change_24h,
    volume: data['24h_volume_thb']
  }
}

function fetch(callback) {
  callback = callback || function(){};
  const val = []
  request(uri.fetch, function (err, resp) {
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
