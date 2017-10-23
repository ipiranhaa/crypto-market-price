const socket = io();

function assignHtmlValue(htmlClass, msg) {
  msg.forEach(function(obj) {
    const price = obj.last_price % 1 !== 0 ? obj.last_price.toFixed(2) : obj.last_price;    
    const className = 'span.' + htmlClass + '-' + obj.name.toLowerCase();
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