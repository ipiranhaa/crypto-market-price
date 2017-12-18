const socket = io();

function assignHtmlValue(htmlClass, msg) {
  msg.forEach(function(obj) {
    const floatPrice = parseFloat(obj.last_price);
    const price = floatPrice % 1 !== 0 ? floatPrice.toFixed(2) : floatPrice;    
    const className = '.' + htmlClass + '-' + obj.name.toLowerCase();
    if ($(className).text() != price) {
      $(className).fadeOut(function() {
        $(this).text(price);
      }).fadeIn();
    }
  }, this);
}

socket.on('online', function(msg) {
  $('span.users').html(msg);
});

socket.on('bx', function(msg) {
  // console.log('BX: ', msg);
  assignHtmlValue('bx', msg);
});

socket.on('bfx', function(msg) {
  // console.log('BFX: ', msg);
  assignHtmlValue('bfx', msg);  
});

socket.on('coinbase', function(msg) {
  // console.log('COINBASE: ', msg);
  assignHtmlValue('cb', msg);  
});

socket.on('cex', function(msg) {
  // console.log('CEX: ', msg);
  assignHtmlValue('cex', msg);  
});

socket.on('bittrex', function(msg) {
  // console.log('BITTREX: ', msg);
  assignHtmlValue('btx', msg);  
});

socket.on('binance', function(msg) {
  // console.log('BINANCE: ', msg);
  assignHtmlValue('bin', msg);  
});

socket.on('coinmarketcap', function(msg) {
  // console.log('COINMARKETCAP: ', msg);
  assignHtmlValue('cmc', msg);  
});

// Notification
window.configMsg = {
  hello: 'สวัสดีทุกท่านครับ',
  donate: 'ท่านสามารถให้กำลังใจผู้พัฒนาได้หลายช่องทาง คลิกปุ่ม Donate ด่านล่างได้เลยครับ'
}

socket.on('notification', function(msg) {
  toastr.options.timeOut = 10000;
  toastr.options.extendedTimeOut = 5000;
  toastr.info(msg);
});

window.boardcast = function(msg) {
  socket.emit('boardcast', msg);
}

// Google Analytic
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());

gtag('config', 'UA-111347586-1');
