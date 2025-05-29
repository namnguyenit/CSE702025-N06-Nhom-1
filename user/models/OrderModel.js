const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    group: { type: String, required: true },
    idSP: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    image: { type: String }
}, { _id: false });

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        // district: { type: String, required: true },
        // ward: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ['chờ duyệt', 'chờ giao', 'đang giao', 'giao thành công', 'bị hủy'],
        default: 'chờ duyệt'
    },
    paymentMethod: { type: String, default: 'COD' },
    paymentStatus: { type: String, enum:['chưa thanh toán', 'đã thanh toán'], default: 'chưa thanh toán' },
    shipper: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    notes: {
        user: { type: String, default: '' },
        admin: { type: String, default: '' },
        shipper: { type: String, default: '' }
    },
    cancellationReason: { type: String, default: '' },
    timestamps: {
        createdAt: { type: Date, default: Date.now },
        approvedAt: { type: Date },
        assignedAt: { type: Date },
        shippedAt: { type: Date }, // Thời điểm shipper bắt đầu giao
        deliveredAt: { type: Date },
        cancelledAt: { type: Date }
    }
}, { timestamps: true }); // createdAt, updatedAt của Mongoose

module.exports = mongoose.model('Order', orderSchema);