const express = require('express');
const app = express();
const path = require('path');

// src
const bx = require('./modules/bx.js');
const bfx = require('./modules/bitfinex.js');
const _ = require('lodash');


let bxCache = {};
let bfxCache = {};
let onlineUser = 0;
 
const server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening... :3000');
});

// socket
const io = require('socket.io').listen(server);

function updateOnlineUser(oper) {
  if (oper === '+') {
    onlineUser++;
  } else {
    onlineUser--;
  }
  
  console.log(onlineUser + ' users online');
  io.emit('online', onlineUser);
}

function sendCache() {
  if (!_.isEmpty(bxCache)) {
    io.emit('bx', bxCache);        
  }

  if (!_.isEmpty(bfxCache)) {
    io.emit('bfx', bfxCache);        
  }
}

bx.fetch(function(data) {
  bxCache = data;
});

bfx.fetch(function(data) {
  bfxCache = data;
});

io.on('connection', function(socket) {
  const ip = socket.handshake.address;
  console.log('a user connected with ' + ip);

  io.emit('ip', ip) ;
  io.emit('bx', bxCache)
  io.emit('bfx', bfxCache) 
  updateOnlineUser('+');

  socket.on('disconnect', function() {
    updateOnlineUser('-');
  });
});

setInterval(function(){
  bx.fetch(function(data) {
    // console.log('<< BX >>', data);
    bxCache = data;
    io.emit('bx', data)
  });

  bfx.fetch(function(data) {
    // console.log('<< BFX >>', data);
    bfxCache = data;
    io.emit('bfx', data)  
  });
}, 30000);
 
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
 
app.get('/', function(req, res) {
    res.render('index');
});