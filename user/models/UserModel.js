const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const cartSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, required: true },
    size: { type: String, required: true },
    orderNumber: { type: Number, required: true, min: 1 }
}, { _id: false });

const reviewProductSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    commentAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new Schema({
    account: { type: String, required: true},
    password: { type: String, required: true },
    role: { type: String, default: 'User' },
    name: { type: String, required: true },
    phone: String,
    gmail: String,
    address: { type: String },
    carts: [cartSchema],
    reviewProducts: [reviewProductSchema],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    wishlist: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);