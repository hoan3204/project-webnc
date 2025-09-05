const mongoose = require('mongoose');

const slug = require('mongoose-slug-updater');
const Category = require('./category.model');
const { number } = require('joi');
mongoose.plugin(slug);

const schema = new mongoose.Schema(
  {
    name: String,
    category: String,
    position: String,
    status:String,
    avatar: String,
    priceAdult: Number,
    priceChildren: Number,
    priceBaby: Number,
    priceNewAdult:Number,
    priceNewChildren: Number,
    priceNewBaby: Number,
    stockAdult: Number,
    stockChildren: Number,
    stockBaby: Number,
    locations: Array,
    time: String,
    vehicle: String,
    departureDate: Date,
    information: String,
    schedules: Array,
    images:Array,
    createdBy: String,
    updatedBy: String,
    slug: {
      type: String,
      slug: "name",
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },{
    timestamps: true, // tu dong sinh ra createdat va updateedat
  }
)

const Tour = mongoose.model("Tour", schema, "tour")

module.exports = Tour;