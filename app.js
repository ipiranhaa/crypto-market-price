const express = require('express');
const app = express();
const path = require('path');

// src
const bx = require('./modules/bx.js');
const bfx = require('./modules/bitfinex.js');
 
const server = app.listen(4004, function() {
    console.log('Listening...');
});

// socket
const io = require('socket.io').listen(server);
io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('chat', function(message) {
    console.log(message);
  });
});

bx.fetch(function(data) {
  console.log('<< BX >>', data);
});

bfx.fetch(function(data) {
  console.log('<< BFX >>', data);
});
 
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
 
app.get('/', function(req, res) {
    res.render('index');
});