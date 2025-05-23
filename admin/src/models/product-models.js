const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const products = new Schema({
  userID: { type: String },
  categoryID: { type: String },
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  stock: { type: Number },
  image: {
    imageName: { type: String },
    imageType: { type: String },
    imageData: { type: Buffer },
  },
});

module.exports = mongoose.model("products", products);
