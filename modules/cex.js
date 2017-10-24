const request = require('request');
const _ = require('lodash');

const uri = {
  fetch: 'https://cex.io/api/tickers/USD'
}

const filter = [
  'BTC:USD',  // BTC
  'ETH:USD',  // ETH
]

function parser(data) {
  return {
    name: data.name,
    last_price: data.last * global.THB,
    currency: 'THB',
    change: null,
    volume: null
  }
}

function fetch(callback) {
  callback = callback || function(){};
  const val = []
  request(uri.fetch, function (err, resp) {
    if (!err && resp.body[0] !== '<') {
      const data = JSON.parse(resp.body);
      _.each(data.data, function(obj) {
        if (obj.pair === filter[0]) {
          obj.name = filter[0].split(':')[0];
          val.push(parser(obj));
        } else if (obj.pair === filter[1]) {
          obj.name = filter[1].split(':')[0];
          val.push(parser(obj));
        }
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
