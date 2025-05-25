const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carts = new Schema({
  productID: String,
  orderNumber: Number,
});

module.exports = carts;
