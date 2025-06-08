const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    name: String,
    price: Schema.Types.Mixed,
    size: String,
    image: {
        imageName: String,
        imageType: String,
        imageData: Buffer
    },
    group: String,
    idSP: String
}, { _id: false });

const orderSchema = new Schema({
    shiperID: { type: Schema.Types.ObjectId, ref: 'User' },
    orderDate: { type: Date, default: Date.now },
    shipDate: Date,
    shipAddress: String,
    totalAmount: Number,
    status: String,
    items: [orderItemSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shippingAddress: {
        fullName: String,
        address: String,
        phone: String,
        email: String
    },
    paymentMethod: String,
    paymentStatus: String
});

module.exports = mongoose.model('Order', orderSchema);