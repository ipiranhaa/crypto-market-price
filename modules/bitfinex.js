const request = require('request');
const _ = require('lodash');

const url = "https://api.bitfinex.com/v1"
const filter = ['btcusd', 'ethusd', 'omgusd'];

function get(symbol, callback) {
  request.get(url + "/pubticker/" + symbol,
  function(err, resp, body) {
    if (!err) {
      callback(body)
    }
  });
}

function fetch(callback) {
  callback = callback || function() {};
  const val = [];
  _.each(filter, function(symbol) {
    get(symbol, function(data) {
      if (data) {
        val.push(data);
      }

      if (val.length === filter.length) {
        callback(val);
      }
    });
  })
}

module.exports = {
  fetch
};
