const socket = io();
const availableCurrency = ['thb', 'usd'];
let selectedCurrency = 'thb';

// Todo: revise models
const exchangesNames = ['bx', 'bfx', 'cb', 'btx', 'bin', 'cex', 'cmc', 'gdax'];
const mainCoins = ['btc', 'eth', 'bch', 'ltc'];
const exchangesFullNames = {
  'bx': 'BX',
  'bfx': 'Bitfinex',
  'cb': 'Coinbase',
  'btx': 'Bittrex',
  'bin': 'Binance',
  'cex': 'Cex.io',
  'cmc': 'Coinmarketcap',
  'gdax': 'GDAX'
}
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
    'NEO': JSON.parse(JSON.stringify(defaultModel)),
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

  assignArbitrageTableDetail();
});

socket.on('bfx', function(msg) {
  assignHtmlValue('bfx', msg);
  
  msg.forEach(coin => {
    Object.assign(collection.bfx[coin.name], coin);
  })

  assignArbitrageTableDetail();
});

socket.on('coinbase', function(msg) {
  // assignHtmlValue('cb', msg);  

  msg.forEach(coin => {
    Object.assign(collection.cb[coin.name], coin);
  })

  assignArbitrageTableDetail();
});

socket.on('cex', function(msg) {
  assignHtmlValue('cex', msg); 
  
  msg.forEach(coin => {
    Object.assign(collection.cex[coin.name], coin);
  })

  assignArbitrageTableDetail();
});

socket.on('bittrex', function(msg) {
  assignHtmlValue('btx', msg);  

  msg.forEach(coin => {
    Object.assign(collection.btx[coin.name], coin);
  })

  assignArbitrageTableDetail();
});

socket.on('binance', function(msg) {
  assignHtmlValue('bin', msg);  

  msg.forEach(coin => {
    Object.assign(collection.bin[coin.name], coin);
  })

  assignArbitrageTableDetail();
});

socket.on('coinmarketcap', function(msg) {
  assignHtmlValue('cmc', msg);  

  msg.forEach(coin => {
    Object.assign(collection.cmc[coin.name], coin);
  })
});

socket.on('gdax', function(msg) {
  // assignHtmlValue('gdax', msg);  

  msg.forEach(coin => {
    Object.assign(collection.gdax[coin.name], coin);
  })

  assignArbitrageTableDetail();
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
    const randomNumber = Math.floor(Math.random() * 10);
    $('#contact-board').append(`<span id="PHNjcmlwdA${randomNumber}">${msg}</span>`);
    setTimeout(() => { 
      $(`#PHNjcmlwdA${randomNumber}`).remove();
    }, 10000);
  } else {
    toastr.info(msg);
  }
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

$('#calculator-btn').click(e => {
  selectNavbarMenu(e.target.id);
  showPage('calculator-board');
})

$('#contact-btn').click(e => {
  selectNavbarMenu(e.target.id);
  showPage('contact-board');
})

$('#settings-btn').click(e => {
  selectNavbarMenu(e.target.id);
  showPage('settings-board');
})

//
// ─── ARBITAGE COMPARE ───────────────────────────────────────────────────────────
//

$(document).ready(() => {
  changeBaseCurrencyUI();

  const selectedExchanges = exchangesNames.filter(name => name !== 'cmc');
  mainCoins.forEach(coinName => {
    let template = [];    
    selectedExchanges.forEach(sourceExchanges => {
      const rows = selectedExchanges
        .filter(name => name !== sourceExchanges)
        .map((destinationExchanges, idx) => {
          if (idx !== 0) {
            return `
              <tr>
                <td>${exchangesFullNames[destinationExchanges]}</td>
                <td class="${coinName}-${sourceExchanges}-${destinationExchanges} text-center">-</td>
              </tr>
            `
          } else {
            return `
              <tr>
                <td rowspan="6" class="text-center align-middle">
                  <img src="img/exchanges/${sourceExchanges}-logo.png">
                </td>
                <td>${exchangesFullNames[destinationExchanges]}</td>
                <td class="${coinName}-${sourceExchanges}-${destinationExchanges} text-center">-</td>
              </tr>
            `
          }
        })

      let rowsStr = '';
      rows.forEach(str => {
        rowsStr += str
      })
      
      template.push(`
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-4">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th class="text-center">Source</th>
                <th class="text-center">Destination</th>
                <th class="text-center">Profit (%)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsStr}
            </tbody>
          </table>
        </div>
      `)
    })
    
    template = _.reverse(template);
    template.forEach(temp => $('#arbitrage-board .' + coinName + '-title').after(temp));
    template = [];
  })
})

const assignArbitrageTableDetail = () => {
  const clearStyled = (selectorStr) => {
    if ($(selectorStr).hasClass('form-plus')) {
      $(selectorStr).removeClass('form-plus')
    }

    if ($(selectorStr).hasClass('form-minus')) {
      $(selectorStr).removeClass('form-minus')
    }
  }

  const selectedExchanges = exchangesNames.filter(name => name !== 'cmc');
  mainCoins.forEach(coinName => {
    selectedExchanges.forEach(sourceExchanges => {
      const availableExchanges = selectedExchanges.filter(name => name !== sourceExchanges);
      availableExchanges.forEach(destinationExchanges => {
        const elemSeletor = '#arbitrage-board .' + coinName + '-' + sourceExchanges + '-' + destinationExchanges;
        const sourcePrice = collection[sourceExchanges][coinName.toUpperCase()].last_price;
        const destinationPrice = collection[destinationExchanges][coinName.toUpperCase()].last_price;
        if (sourcePrice && destinationPrice) {
          const summaryPercent = (((destinationPrice - sourcePrice) / sourcePrice) * 100).toFixed(2)
          
          // Set styled
          clearStyled(elemSeletor);
          if (summaryPercent > 0) {
            $(elemSeletor).addClass('form-plus')
          } else if (summaryPercent < 0) {
            $(elemSeletor).addClass('form-minus')            
          }

          $(elemSeletor).html(summaryPercent);
        }
      })
    })
  })
}

//
// ─── CALCULATOR ─────────────────────────────────────────────────────────────
//

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
// ─── SETTINGS ───────────────────────────────────────────────────────────────────
//

$('#settings-board #base-currency').on('change', e => {
  const value = e.target.value;
  setBaseCurrency(value);
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
  const pageList =['ticker-board', 'arbitrage-board', 'calculator-board', 'donation-board', 'contact-board', 'settings-board'];
  pageList.forEach(id => {
    if (id !== pageId) {
      $('#' + id).hide();
    } else {
      $('#' + id).show();
    }
  })
}

const changeBaseCurrencyUI = () => {
  getBaseCurrency();

  const diffCurrencyArray = availableCurrency.filter(curr => selectedCurrency !== curr);
  $('#ticker-board .currency-label').html(diffCurrencyArray[0].toUpperCase());
  $('#settings-board #base-currency').val(selectedCurrency);
}

const getBaseCurrency = () => {
  const currencyValue = Cookies.get('currency');
  if (currencyValue) {
    const currency = atob(currencyValue);

    if (availableCurrency.indexOf(currency) > -1) {
      selectedCurrency = currency;
    } else {
      selectedCurrency = 'thb';
      setBaseCurrency('thb');
    }
  }
}

const setBaseCurrency = (value) => {
  Cookies.set('currency', btoa(value));
  changeBaseCurrencyUI();
}

const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}