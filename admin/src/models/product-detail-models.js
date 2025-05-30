const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detail = new Schema({
  size: String,
  price: Number,
  stock: Number,
});

module.exports = detail;
