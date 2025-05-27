const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detail = new Schema({
  size: String,
  price: String,
  stock: Number,
});

module.exports = detail;
