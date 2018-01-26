const request = require('request');
const _ = require('lodash');
const Model = require('./model.js');

const uri = {
  fetch: 'https://bx.in.th/api/'
}

const filter = [
  1,  // BTC
  21, // ETH
  26, // OMG
  25, // XRP
  27, // BCH
  28, // EVX
  22, // DAS
  30, // LTC
  29, // XZC
]

function parser(data) {
  const result = new Model();
  if (!data) return result;

  result.name = data.secondary_currency;
  result.last_price = data.last_price;
  result.last_price_usd = data.last_price / global.THB;
  result.volume = data.volume_24hours;
  result.change = data.change;

  return result;
}

function fetch(callback) {
  callback = callback || function(){};
  const val = []
  request(uri.fetch, function (err, resp) {
    if (!err && resp.body[0] !== '<') {
      const data = JSON.parse(resp.body);
      _.each(filter, function(num) {
        val.push(parser(data[num.toString()]));
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
