const express = require("express");
const app = express();
const path = require("path");

// src
const bfx = require("./modules/bitfinex.js");
const coinbase = require("./modules/coinbase.js");
const cex = require("./modules/cex.js");
const bittrex = require("./modules/bittrex.js");
const binance = require("./modules/binance.js");
const coinmarketcap = require("./modules/coinmarketcap.js");
const gdax = require("./modules/gdax.js");
const util = require("./modules/utils.js");
const _ = require("lodash");

let onlineUser = 0;
let bfxCache = [];
let coinbaseCache = [];
let cexCache = [];
let bittrexCache = [];
let binanceCache = [];
let coinMarketCapCache = [];
let gdaxCache = [];

let isBfxFetched = false;
let isCoinbaseFetched = false;
let isCexFetched = false;
let isBittrexFetched = false;
let isBinanceFetched = false;
let isCoinMarketCapFetched = false;
let isGdaxFetched = false;

const configMsg = {
  hello: "สวัสดีครับ",
  donate: "อย่าลืม Donate ให้กำลังใจกันด้วยนะครับ 💖",
  topDonator: "Krisada: ฿750 THB"
};

const settings = {
  servPort: 3000,
  fetchCurrencyTime: 600000,
  fetchPriceTime: 20000,
  fetchTiming: {
    bitfinex: 30000,
    coinmarketcap: 30000
  },
  noticeTime: 1800000
};

const server = app.listen(process.env.PORT || settings.servPort, function() {
  console.log("Listening... :" + (process.env.PORT || settings.servPort));
});

// socket
const io = require("socket.io").listen(server);

function updateOnlineUser(oper) {
  if (oper === "+") {
    onlineUser++;
  } else {
    onlineUser--;
  }

  console.log(onlineUser + " users online");
  io.emit("online", onlineUser);
}

function welcomeMsg(socket) {
  socket.emit("notification", configMsg.donate);
}

function topDonator(socket) {
  socket.emit("topDonator", configMsg.topDonator);
}

function sendCache() {
  if (isBfxFetched) {
    io.emit("bfx", bfxCache);
  }

  if (isCoinbaseFetched) {
    io.emit("coinbase", coinbaseCache);
  }

  if (isCexFetched) {
    io.emit("cex", cexCache);
  }

  if (isBittrexFetched) {
    io.emit("bittrex", bittrexCache);
  }

  if (isBinanceFetched) {
    io.emit("binance", binanceCache);
  }

  if (isCoinMarketCapFetched) {
    io.emit("coinmarketcap", coinMarketCapCache);
  }

  if (isGdaxFetched) {
    io.emit("gdax", gdaxCache);
  }
}

util.getCurrency("usd", "thb", function(value) {
  console.log("1 USD = " + value + " THB");
  global.THB = value;

  bfx.fetch(function(data) {
    isBfxFetched = true;
    bfxCache = data;
  });

  coinbase.fetch(function(data) {
    isCoinbaseFetched = true;
    coinbaseCache = data;
  });

  cex.fetch(function(data) {
    isCexFetched = true;
    cexCache = data;
  });

  bittrex.fetch(function(data) {
    isBittrexFetched = true;
    bittrexCache = data;
  });

  binance.fetch(function(data) {
    isBinanceFetched = true;
    binanceCache = data;
  });

  coinmarketcap.fetch(function(data) {
    isCoinMarketCapFetched = true;
    coinMarketCapCache = data;
  });

  gdax.fetch(function(data) {
    isGdaxFetched = true;
    gdaxCache = data;
  });
});

io.on("connection", function(socket) {
  sendCache();
  updateOnlineUser("+");
  // welcomeMsg(socket);
  topDonator(socket);

  socket.on("disconnect", function() {
    updateOnlineUser("-");
  });

  socket.on("boardcast", function(msg) {
    io.emit("notification", msg);
  });
});

setInterval(function() {
  util.getCurrency("usd", "thb", function(value) {
    console.log("1 USD = " + value + " THB");
    global.THB = value;
  });
}, settings.fetchCurrencyTime);

setInterval(function() {
  bfx.fetch(function(data) {
    bfxCache = data;
    io.emit("bfx", data);
  });

  coinbase.fetch(function(data) {
    coinbaseCache = data;
    io.emit("coinbase", data);
  });

  cex.fetch(function(data) {
    cexCache = data;
    io.emit("cex", data);
  });

  bittrex.fetch(function(data) {
    bittrexCache = data;
    io.emit("bittrex", data);
  });

  binance.fetch(function(data) {
    binanceCache = data;
    io.emit("binance", data);
  });

  gdax.fetch(function(data) {
    gdaxCache = data;
    io.emit("gdax", data);
  });
}, settings.fetchPriceTime);

setInterval(function() {
  bfx.fetch(function(data) {
    bfxCache = data;
    io.emit("bfx", data);
  });
}, settings.fetchTiming.bitfinex);

setInterval(function() {
  coinmarketcap.fetch(function(data) {
    coinMarketCapCache = data;
    io.emit("coinmarketcap", data);
  });
}, settings.fetchTiming.coinmarketcap);

// Auto notification
setInterval(function() {
  welcomeMsg(socket);
}, settings.noticeTime);

app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("index");
});
