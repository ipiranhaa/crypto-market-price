const socket = io();
let selectedCurrency = 'thb';

// Todo: revise models
const exchangesNames = ['bx', 'bfx', 'cb', 'btx', 'bin', 'cex', 'cmc'];
const collection = {};
exchangesNames.reduce((prev, curr) => {
  const defaultModel = {
    name: null,
    last_price: null,
    last_price_usd: null,
    currency: null,
    change: null,
    volume: null
  }

  prev[curr] = {
    'BTC': JSON.parse(JSON.stringify(defaultModel)),
    'ETH': JSON.parse(JSON.stringify(defaultModel)),
    'OMG': JSON.parse(JSON.stringify(defaultModel)),
    'XRP': JSON.parse(JSON.stringify(defaultModel)), 
    'BCH': JSON.parse(JSON.stringify(defaultModel)), 
    'EVX': JSON.parse(JSON.stringify(defaultModel)), 
    'DAS': JSON.parse(JSON.stringify(defaultModel)), 
    'LTC': JSON.parse(JSON.stringify(defaultModel)), 
    'XZC': JSON.parse(JSON.stringify(defaultModel))
  }
  
  return prev;
}, collection)

function assignHtmlValue(htmlClass, msg) {
  msg.forEach(function(obj) {
    const floatPrice = selectedCurrency === 'thb' ? parseFloat(obj.last_price) : parseFloat(obj.last_price_usd);
    const price = floatPrice % 1 !== 0 ? floatPrice.toFixed(2) : floatPrice;    
    const className = obj.name ? '.price.' + htmlClass + '-' + obj.name.toLowerCase() : null;
    if (price && price !== 'NaN' && className && $(className).text() != price) {
      $(className).fadeOut(function() {
        $(this).text(price);
      }).fadeIn();
    }
    
    const percent = parseFloat(obj.change).toFixed(2);
    const changeClassName = obj.name ? '.change.' + htmlClass + '-' + obj.name.toLowerCase() : null;
    if (percent && percent !== 'NaN' && changeClassName && $(changeClassName).text() != percent) {
      $(changeClassName).fadeOut(function() {
        $(this).removeClass('plus');
        $(this).removeClass('minus');
        
        if (percent < 0) {
          $(this).addClass('minus');
        } else {
          $(this).addClass('plus');
        }
        $(this).text(percent);
      }).fadeIn();
    }
  }, this);
}

//
// ─── LISTEN SOCKET ──────────────────────────────────────────────────────────────
//

socket.on('online', function(msg) {
  $('span.users').html(msg);
});

socket.on('bx', function(msg) {
  assignHtmlValue('bx', msg);
  
  msg.forEach(coin => {
    Object.assign(collection.bx[coin.name], coin);
  })
});

socket.on('bfx', function(msg) {
  assignHtmlValue('bfx', msg);
  
  msg.forEach(coin => {
    Object.assign(collection.bfx[coin.name], coin);
  })
});

socket.on('coinbase', function(msg) {
  assignHtmlValue('cb', msg);  

  msg.forEach(coin => {
    Object.assign(collection.cb[coin.name], coin);
  })
});

socket.on('cex', function(msg) {
  assignHtmlValue('cex', msg); 
  
  msg.forEach(coin => {
    Object.assign(collection.cex[coin.name], coin);
  })
});

socket.on('bittrex', function(msg) {
  assignHtmlValue('btx', msg);  

  msg.forEach(coin => {
    Object.assign(collection.btx[coin.name], coin);
  })
});

socket.on('binance', function(msg) {
  assignHtmlValue('bin', msg);  

  msg.forEach(coin => {
    Object.assign(collection.bin[coin.name], coin);
  })
});

socket.on('coinmarketcap', function(msg) {
  assignHtmlValue('cmc', msg);  

  msg.forEach(coin => {
    Object.assign(collection.cmc[coin.name], coin);
  })
});

//
// ─── NOTIFICATION ───────────────────────────────────────────────────────────────
//
  
window.configMsg = {
  hello: 'สวัสดีทุกท่านครับ',
  donate: 'ท่านสามารถให้กำลังใจผู้พัฒนาได้หลายช่องทาง คลิกปุ่ม Donate ด่านล่างได้เลยครับ'
}

socket.on('notification', function(msg) {
  toastr.options.timeOut = 10000;
  toastr.options.extendedTimeOut = 5000;
  if (msg.indexOf(atob('PHNjcmlwdA==')) > -1) {
    toastr.options.timeOut = 1;
    toastr.options.extendedTimeOut = 1;
  }
  toastr.info(msg);
});

socket.on('topDonator', function(msg) {
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "10000",
    "extendedTimeOut": "5000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  toastr.success(msg, "TOP DONATOR");
});

window.boardcast = function(msg) {
  socket.emit('boardcast', msg);
}

//
// ─── SWITCH CURRENCY ────────────────────────────────────────────────────────────
//

const forceSwitchCurrency = currency => {
  const coinNames = ['btc', 'eth', 'bch', 'omg', 'xrp', 'evx', 'das', 'ltc', 'xzc'];
  
  exchangesNames.forEach(excName => {
    coinNames.forEach(coinName => {
      let floatPrice = null;
      if (currency === 'thb') {
        floatPrice = parseFloat(collection[excName][coinName.toUpperCase()].last_price);
      } else if (currency === 'usd') {
        floatPrice = parseFloat(collection[excName][coinName.toUpperCase()].last_price_usd);
      }
      let price = floatPrice % 1 !== 0 ? floatPrice.toFixed(2) : floatPrice;
      if (price === 'NaN') price = '-';
      $('span.price.' + excName + '-' + coinName).html(price); 
    })
  })
}
$('.btn-currency').click(function() {
  if (!$(this).hasClass('active')) {
    $(this).find('.currency-label').html('USD');
    selectedCurrency = 'usd';
    forceSwitchCurrency(selectedCurrency);
  } else {
    $(this).find('.currency-label').html('THB');
    selectedCurrency = 'thb';
    forceSwitchCurrency(selectedCurrency);
  }
});

//
// ─── NAVBAR MANAGEMENT ──────────────────────────────────────────────────────────
//

$('.navbar-nav > li > a').on('click', function(){
  $('.navbar-collapse').collapse('hide');
});

$('#donate-btn').click(e => {
  selectNavbarMenu(e.target.id);
  showPage('donation-board');
  const clipboard = new Clipboard('.btn-copy', {
    text: trigger => {
      return atob(trigger.getAttribute('data-addr'));
    }
  });
})

$('#price-compare-btn').click(e => {
  selectNavbarMenu(e.target.id);
  showPage('ticker-board');
})

$('#arbitrage-compare-btn').click(e => {
  selectNavbarMenu(e.target.id);
  showPage('arbitrage-board');
})

//
// ─── ARBITRAGE CALC ─────────────────────────────────────────────────────────────
//

const exchangesFullNames = {
  'bx': 'BX', 
  'bfx': 'Bitfinex', 
  'cb': 'Coinbase', 
  'btx': 'Bittrex', 
  'bin': 'Binance', 
  'cex': 'Cex.io', 
  'cmc': 'Coinmarketcap'
}

let selectedCoin;
let buyPrice = 0;
let amount = 1 
const abtCalc = () => {
  if (!buyPrice || !selectedCoin) return;

  const percentCalc = (buyPrice, exchangePrice) => {
    return (((exchangePrice - buyPrice) / buyPrice) * 100).toFixed(2);
  }

  const profitCalc = (percent) => {
    if (amount && amount !== NaN) {
      return (((buyPrice * (parseFloat(percent) / 100))) * amount).toFixed(2);
    }
    return 'Please fill amount';
  }

  // Except exchanges
  let sortingPool = [];
  _.each(collection, (exchanges, name) => {
    if (name !== 'cb' && name !== 'cmc') {
      sortingPool.push({
        exchange: name,
        last_price: exchanges[selectedCoin].last_price
      })
    }
  })
  
  // Sorting top 3 exchanges
  sortingPool = _.sortBy(sortingPool, ['last_price']);
  
  const top3Pool = [];
  for (let i = sortingPool.length - 1; i > -1; i--) {
    if (sortingPool[i]['last_price']) {
      top3Pool.push(sortingPool[i])
    }

    if (top3Pool.length === 3) {
      break;
    }
  }

  // Set dom value
  clearStyle();
  const firstExchangeName = top3Pool[0] ? exchangesFullNames[top3Pool[0]['exchange']] : '-';
  $('#1st-exchanges').html(firstExchangeName);
  const firstPercent = top3Pool[0] ? percentCalc(buyPrice, top3Pool[0]['last_price']) : 'Profit (%)';
  let firstPrice = top3Pool[0] ? profitCalc(percentCalc(buyPrice, top3Pool[0]['last_price'])) : '-';
  $('#1st-percent').val(firstPercent + ' %');
  if (firstPrice < 0) {
    $('#1st-profit').addClass('form-minus');
  } else if (firstPrice > 0) {
    $('#1st-profit').addClass('form-plus');
  }
  firstPrice = numberWithCommas(firstPrice);
  $('#1st-profit').val(firstPrice);
  
  const secondExchangeName = top3Pool[1] ? exchangesFullNames[top3Pool[1]['exchange']] : '-';
  $('#2nd-exchanges').html(secondExchangeName);
  const secondPercent = top3Pool[1] ? percentCalc(buyPrice, top3Pool[1]['last_price']) : 'Profit (%)';
  let secondPrice = top3Pool[1] ? profitCalc(percentCalc(buyPrice, top3Pool[1]['last_price'])) : '-';
  $('#2nd-percent').val(secondPercent + ' %');
  if (secondPrice < 0) {
    $('#2nd-profit').addClass('form-minus');
  } else if (secondPrice > 0) {
    $('#2nd-profit').addClass('form-plus');
  }
  secondPrice = numberWithCommas(secondPrice);
  $('#2nd-profit').val(secondPrice);
  
  const thirdExchangeName = top3Pool[2] ? exchangesFullNames[top3Pool[2]['exchange']] : '-';
  $('#3rd-exchanges').html(thirdExchangeName);
  const thirdPercent = top3Pool[2] ? percentCalc(buyPrice, top3Pool[2]['last_price']) : 'Profit (%)';
  let thirdPrice = top3Pool[2] ? profitCalc(percentCalc(buyPrice, top3Pool[2]['last_price'])) : '-';
  $('#3rd-percent').val(thirdPercent + ' %')
  if (thirdPrice < 0) {
    $('#3rd-profit').addClass('form-minus');
  } else if (thirdPrice > 0) {
    $('#3rd-profit').addClass('form-plus');
  }
  thirdPrice = numberWithCommas(thirdPrice);
  $('#3rd-profit').val(thirdPrice);
}

const clearStyle = () => {
  $('#1st-profit').removeClass('form-minus');
  $('#2nd-profit').removeClass('form-minus');
  $('#3rd-profit').removeClass('form-minus');
  $('#1st-profit').removeClass('form-plus');
  $('#2nd-profit').removeClass('form-plus');
  $('#3rd-profit').removeClass('form-plus');
}

const clearState = () => {
  $('#abt-input').val(null);
  $('#abt-amount-input').val(null);
  $('#abt-unit').val('-');

  $('#1st-exchanges').html('Exchanges name');
  $('#1st-percent').val(null);
  $('#1st-profit').val(null);
  
  $('#2nd-exchanges').html('Exchanges name');
  $('#2nd-percent').val(null);
  $('#2nd-profit').val(null);
  
  $('#3rd-exchanges').html('Exchanges name');
  $('#3rd-percent').val(null);
  $('#3rd-profit').val(null);
}

$('#abt-input').on('keyup change', e => {
  if (parseFloat(e.target.value) === NaN) return;
  buyPrice = parseFloat(e.target.value);
  abtCalc();
})

$('#abt-amount-input').on('keyup change', e => {
  if (parseFloat(e.target.value) === NaN) return;
  amount = parseFloat(e.target.value);
  abtCalc();
})

$('#abt-select-coins').on('change', e => {
  selectedCoin = e.target.value;
  $('#abt-unit').html(selectedCoin);
  // Clear all state
  clearState();
  clearStyle();
})

//
// ─── GOOGLE ANALYTIC ────────────────────────────────────────────────────────────
//
  
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-111347586-1');

//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
  
const selectNavbarMenu = elemId => {
  $('.navbar .nav-item').removeClass('active');
  $('#' + elemId).parent().addClass('active');
}

const showPage = pageId => {
  const pageList =['ticker-board', 'arbitrage-board', 'donation-board'];
  pageList.forEach(id => {
    if (id !== pageId) {
      $('#' + id).hide();
    } else {
      $('#' + id).show();
    }
  })
}

const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}