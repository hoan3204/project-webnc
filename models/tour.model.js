const mongoose = require('mongoose');

const Tour = mongoose.model('Tour', {
  name: String,
  vehicle: String
}, "tour");

module.exports = Tour;