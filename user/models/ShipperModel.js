const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipperOrderHistorySchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: ['shipping', 'delivered', 'cancelled'], required: true },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const shipperSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalEarnings: { type: Number, default: 0 },
  orderHistory: [shipperOrderHistorySchema]
});

module.exports = mongoose.model('Shipper', shipperSchema);
