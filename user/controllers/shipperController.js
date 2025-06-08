const Order = require('../models/OrderModel');
const Shipper = require('../models/ShipperModel');
const mongoose = require('mongoose');

exports.getDashboard = async (req, res) => {
    // Lấy các đơn hàng trạng thái waiting
    const waitingOrders = await Order.find({ status: 'waiting' }).populate('user').lean();
    // Lấy các đơn shipper đang giao
    const shippingOrders = await Order.find({ status: 'shipping', shiperID: req.session.user._id }).populate('user').lean();
    // Lấy lịch sử đơn đã giao/hủy
    const deliveredOrders = await Order.find({ status: 'delivered', shiperID: req.session.user._id }).populate('user').lean();
    const cancelledOrders = await Order.find({ status: 'cancelled', shiperID: req.session.user._id }).populate('user').lean();
    // Lấy tổng tiền đã giao thành công
    const totalEarnings = await Order.aggregate([
        { $match: { status: 'delivered', shiperID: new mongoose.Types.ObjectId(req.session.user._id) } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    res.render('shipper/dashboard', {
        title: 'Bảng điều khiển giao hàng',
        waitingOrders,
        shippingOrders,
        deliveredOrders,
        cancelledOrders,
        totalEarnings: totalEarnings[0]?.total || 0
    });
};

// Nhận đơn hàng (chuyển waiting -> shipping)
exports.acceptOrder = async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'waiting') return res.status(400).json({ success: false, message: 'Đơn không hợp lệ' });
    order.status = 'shipping';
    order.shiperID = req.session.user._id;
    await order.save();
    // Lưu vào lịch sử shipper
    await Shipper.updateOne(
        { user: req.session.user._id },
        { $push: { orderHistory: { order: order._id, status: 'shipping' } } },
        { upsert: true }
    );
    res.json({ success: true });
};

// Giao thành công (shipping -> delivered)
exports.deliverOrder = async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'shipping' || String(order.shiperID) !== String(req.session.user._id)) return res.status(400).json({ success: false, message: 'Đơn không hợp lệ' });
    order.status = 'delivered';
    await order.save();
    // Cộng tiền cho shipper
    await Shipper.updateOne(
        { user: req.session.user._id },
        { $inc: { totalEarnings: order.totalAmount }, $push: { orderHistory: { order: order._id, status: 'delivered' } } },
        { upsert: true }
    );
    res.json({ success: true });
};

// Hủy đơn (shipping -> cancelled)
exports.cancelOrder = async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'shipping' || String(order.shiperID) !== String(req.session.user._id)) return res.status(400).json({ success: false, message: 'Đơn không hợp lệ' });
    order.status = 'cancelled';
    await order.save();
    await Shipper.updateOne(
        { user: req.session.user._id },
        { $push: { orderHistory: { order: order._id, status: 'cancelled' } } },
        { upsert: true }
    );
    res.json({ success: true });
};