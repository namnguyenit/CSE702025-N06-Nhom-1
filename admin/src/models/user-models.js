const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = new Schema({
  account: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("users", users);
