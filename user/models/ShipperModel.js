const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipperOrderHistorySchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: ['shipping', 'delivered', 'cancelled'], required: true },
  updatedAt: { type: Date, default: Date.now },
  orderAmount: { type: Number, required: true }, // tổng tiền đơn hàng
  earning: { type: Number, required: true } // tiền công shipper nhận được cho đơn này
}, { _id: false });

const shipperSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalEarnings: { type: Number, default: 0 }, // tổng tiền đã giao thành công
  orderHistory: [shipperOrderHistorySchema] // lịch sử giao hàng, có thể lọc theo trạng thái
  // Có thể bổ sung trường khác nếu cần
});

module.exports = mongoose.model('Shipper', shipperSchema);
