const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  name: String,
  avatar: String,
  slug: String,
  departureDateFormat: String,
  locationFrom: String,
  locationFromName: String,
  priceNewAdult: Number,
  priceNewChildren: Number,
  priceNewBaby: Number,
  quantityAdult: Number,
  quantityChildren: Number,
  quantityBaby: Number,
  checked: Boolean
}, { _id: false });

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  note: String,
  method: String,
  cart: [cartItemSchema],
  deleted: { type: Boolean, default: false },
  deletedBy: String,
  deletedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema, 'Order');