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

// Notification
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

// Switch Currency
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
  console.log(this);
  if (!$(this).hasClass('active')) {
    $(this).find('.currency-label').html('USD');
    selectedCurrency = 'usd';
    forceSwitchCurrency(selectedCurrency);
  } else {
    $(this).find('.currency-label').html('THB');
    selectedCurrency = 'thb';
    forceSwitchCurrency(selectedCurrency);
  }
  console.log(selectedCurrency)
});

// Donate page
$('.btn-donate').click(function() {
  $('#ticker-board').hide();
  $('#donation').show();
  const clipboard = new Clipboard('.btn-copy', {
    text: function(trigger) {
      return atob(trigger.getAttribute('data-addr'));
    }
  });
})

$('.close-donation').click(function() {
  $('#ticker-board').show();
  $('#donation').hide();
})

// Google Analytic
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-111347586-1');
