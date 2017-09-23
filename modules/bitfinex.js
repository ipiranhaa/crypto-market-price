const request = require('request');
const _ = require('lodash');

const url = "https://api.bitfinex.com/v1"
const filter = ['btcusd', 'ethusd', 'omgusd'];
const currency = 'usd'
let thb = 1;

function getCurrency(from, to) {
  const uri = "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D" + from + to + "%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json";
  request.get(uri, function(err, resp, body) {
    if (!err) {
      body = JSON.parse(body);
      thb = !_.isUndefined(body.query.results.row.rate) ? body.query.results.row.rate : 33;
    }
  });
}

getCurrency('usd', 'thb');
setInterval(function(){
  getCurrency('usd', 'thb');
}, 600000);

function parser(data) {
  return {
    name: data.name,
    last_price: data.last_price * thb,
    currency: 'THB',
    change: null,
    volume: data.volume
  }
}

function get(symbol, callback) {
  request.get(url + "/pubticker/" + symbol,
    function(err, resp, body) {
    if (!err) {
      body = JSON.parse(body);
      body.name = symbol.split(currency)[0].toUpperCase();
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
};
