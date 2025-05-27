const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderDetails = new Schema({});

module.exports = mongoose.model("orderDetails", orderDetails);
