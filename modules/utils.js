const request = require('request');
const _ = require('lodash');
let curentCurrency = {
  thb: {
    value: null,
    isFetched: false,
    defaultValue: 33.1895121 // 22 Oct 17
  }
}

// function fetch(from, to, callback) {
//   callback = callback || function(){};
//   const uri = "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D" + from + to + "%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json";
//   request.get(uri, function(err, resp, body) {
//     if (!err) {
//       body = JSON.parse(body);
//       if (!_.isUndefined(body.query.results.row) && !_.isUndefined(body.query.results.row.rate)) {
//         callback(body.query.results.row.rate);
//       }
//     }
//   });
// }

function fetch(from, to, callback) {
  callback = callback || function(){};
  const uri = "https://free.currencyconverterapi.com/api/v6/convert?q=USD_THB&compact=ultra&apiKey=c47bd4ab0930b7aa5658";
  request.get(uri, function(err, resp, body) {
    if (!err && resp.body[0] !== '<') {
      body = JSON.parse(body);
      callback(body['USD_THB']['val']);
    }
  });
}

function getCurrency(from, to, callback) {
  callback = callback || function(){};
  fetch('usd', 'thb', function(value) {       
    callback(value);
  });
}

function nameConverter(name) {
  const lowerName = name.toLowerCase();
  if (lowerName === 'bch' || lowerName === 'bcc') {
    return 'BCH';
  } else if (lowerName === 'dsh' || lowerName === 'dash') {
    return 'DAS';
  }

  return name;
}

module.exports = {
  getCurrency,
  nameConverter
}
