const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const cartSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    orderNumber: { type: Number, required: true, min: 1 }
}, { _id: false });

const reviewProductSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    commentAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new Schema({
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    name: { type: String, required: true },
    phone: String,
    gmail: String,
    address: String,
    carts: [cartSchema],
    reviewProducts: [reviewProductSchema],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
});

module.exports = mongoose.model('User', userSchema);