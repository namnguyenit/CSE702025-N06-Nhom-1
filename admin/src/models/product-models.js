const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailList = new Schema({
  size: String,
  price: Number,
  stock: Number,
});

const products = new Schema({
  name: { type: String },
  description: { type: String },
  type: { type: String },
  detail: [detailList],
  image: {
    imageName: { type: String },
    imageType: { type: String },
    imageData: { type: Buffer },
  },
});

module.exports = mongoose.model("products", products);
