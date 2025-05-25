const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orders = new Schema({
  userID: String,
  orderDate: {
    type: Date,
    default: Date.now,
  },
  shippedDate: Date,
  shippingAddress: String,
  totalAmount: Number,
});

module.exports = mongoose.model("orders", orders);
