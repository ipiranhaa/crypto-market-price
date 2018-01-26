function Model() {
  return {
    name: null,
    last_price: null,
    last_price_usd: null,
    currency: null,
    change: null,
    volume: null
  }
}

Model.prototype.set = function(attr, value) {
  if (!model[attr]) return;
  model[attr] = value;
}

module.exports = Model;