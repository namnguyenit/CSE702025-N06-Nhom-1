const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categories = new Schema({
  name: String,
  image: {
    imageName: { type: String },
    imageType: { type: String },
    imageData: { type: Buffer },
  },
  products: [],
});

module.exports = mongoose.model("categories", categories);
