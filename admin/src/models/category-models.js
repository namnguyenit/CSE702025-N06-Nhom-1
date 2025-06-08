const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailList = new Schema({
  size: String,
  price: Number,
  stock: Number,
});

const productList = new Schema({
  name: { type: String },
  description: { type: String },
  type: { type: String },
  detail: [detailList],
  image: {
    imageName: { type: String },
    imageType: { type: String },
    imageData: { type: Buffer },
  },
  createdAt: Date,
  updatedAt: Date,
});

const categories = new Schema({
  name: String,
  image: {
    imageName: { type: String },
    imageType: { type: String },
    imageData: { type: Buffer },
  },
  products: [productList],
});

module.exports = mongoose.model("categories", categories);
