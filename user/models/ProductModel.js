const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailSchema = new Schema({
    size: String,
    price: String,
    stock: Number
}, { _id: false });

const reviewProductSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product' },
    rating: Number,
    comment: String,
    commentAt: Date
}, { _id: false });

const productSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    type: String,
    image: {
        imageName: String,
        imageType: String,
        imageData: Buffer
    },
    detail: [detailSchema],
    reviewProducts: [reviewProductSchema]
});

module.exports = mongoose.model('Product', productSchema);