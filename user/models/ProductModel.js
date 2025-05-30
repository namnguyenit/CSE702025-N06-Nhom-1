const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const detailList = require("../../admin/src/models/product-detail-models");

const detailSchema = new Schema({
  size: String,
  price: String,
  stock: Number
}, { _id: false });

const productSchema = new Schema({
    name: { type: String },
    description: { type: String },
    type: { type: String },
    detail: [detailSchema],
    image: {
        imageName: { type: String },
        imageType: { type: String },
        imageData: { type: Buffer },
    },
});

module.exports = mongoose.model('Product', productSchema);