const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productNumber: { type: Number, required: true }
}, { _id: false });

const orderSchema = new Schema({
    shiperID: { type: Schema.Types.ObjectId, ref: 'User' },
    orderDate: { type: Date, default: Date.now },
    shipDate: Date,
    shipAddress: String,
    totalAmount: Number,
    status: String,
    items: [orderItemSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Order', orderSchema);