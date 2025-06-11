const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartList = new Schema({
  productID: String,
  orderNumber: Number,
});

const users = new Schema({
  account: String,
  password: String,
  role: String,
  name: String,
  phone: String,
  gmail: String,
  address: String,
  carts: [cartList],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
  
});

module.exports = mongoose.model("users", users);
