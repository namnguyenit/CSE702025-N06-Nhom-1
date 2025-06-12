const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailList = new Schema({
  size: String,
  price: Number,
  stock: Number,
});

const productSchema = new Schema({
  name: String,
  description: String,
  type: String,
  detail: [detailList],
  image: {
    imageName: String,
    imageType: String,
    imageData: Buffer,
  },
});

const categorySchema = new Schema({
  name: { type: String, required: true },
  image: {
    imageName: String,
    imageType: String,
    imageData: Buffer,
  },
  products: [productSchema],
});

module.exports = mongoose.model("Category", categorySchema);
