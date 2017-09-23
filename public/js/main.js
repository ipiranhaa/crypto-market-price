const socket = io();

socket.on('online', function(msg) {
  // console.log(msg + ' users online');
  $('span.users').html(msg);
});

socket.on('bx', function(msg) {
  // console.log('BX: ', msg);
  msg.forEach(function(obj) {
    const price = obj.last_price % 1 !== 0 ? obj.last_price.toFixed(2) : obj.last_price;    
    $('span.bx-' + obj.name.toLowerCase()).html(price);
  }, this);
});

socket.on('bfx', function(msg) {
  // console.log('BFX: ', msg);
  msg.forEach(function(obj) {
    const price = obj.last_price % 1 !== 0 ? obj.last_price.toFixed(2) : obj.last_price;
    $('span.bfx-' + obj.name.toLowerCase()).html(price);
  }, this);
});