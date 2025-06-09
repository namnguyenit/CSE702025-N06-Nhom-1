const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailSchema = new Schema({
    size: String,
    price: Number, // Đổi từ String sang Number để đồng bộ với admin
    stock: Number
}, { _id: false });

const reviewProductSchema = new Schema({
    userid: { type: Schema.Types.ObjectId, ref: 'User' },
    star: { type: Number, min: 1, max: 5 },
    comment: String,
    commentAt: { type: Date, default: Date.now }
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