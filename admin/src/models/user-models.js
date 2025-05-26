const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartLists = require("./cart-models");

const users = new Schema({
  account: String,
  password: String,
  role: String,
  carts: [cartLists],
});

module.exports = mongoose.model("users", users);
