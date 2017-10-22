const request = require('request');
const _ = require('lodash');
let curentCurrency = {
  thb: {
    value: null,
    isFetched: false,
    defaultValue: 33.1895121 // 22 Oct 17
  }
}

function fetch(from, to, callback) {
  callback = callback || function(){};
  const uri = "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D" + from + to + "%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json";
  request.get(uri, function(err, resp, body) {
    if (!err) {
      body = JSON.parse(body);
      if (!_.isUndefined(body.query.results.row) && !_.isUndefined(body.query.results.row.rate)) {
        callback(body.query.results.row.rate);
      }
    }
  });
}

function getCurrency(from, to, callback) {
  callback = callback || function(){};
  if (from === 'usd' && to === 'thb') {
    fetch('usd', 'thb', function(value) {       
      callback(value);
    });
  }
}

module.exports = {
  getCurrency
}
