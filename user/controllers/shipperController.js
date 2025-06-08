const Order = require('../models/OrderModel');
const Shipper = require('../models/ShipperModel');
const mongoose = require('mongoose');

function calcShipperEarning(orderAmount) {
    return Math.round(7500 + orderAmount * 0.015);
}

exports.getDashboard = async (req, res) => {
    // Lấy các đơn hàng trạng thái waiting
    const waitingOrders = await Order.find({ status: 'waiting' }).populate('user').lean();
    // Lấy các đơn shipper đang giao
    const shippingOrders = await Order.find({ status: 'shipping', shiperID: req.session.user._id }).populate('user').lean();
    // Lấy lịch sử đơn đã giao/hủy
    const deliveredOrders = await Order.find({ status: 'delivered', shiperID: req.session.user._id }).populate('user').lean();
    const cancelledOrders = await Order.find({ status: 'cancelled', shiperID: req.session.user._id }).populate('user').lean();
    // Lấy tổng tiền đã giao thành công từ model Shipper
    const shipper = await Shipper.findOne({ user: req.session.user._id });
    const totalEarnings = shipper ? shipper.totalEarnings : 0;
    const orderHistory = shipper ? shipper.orderHistory : [];
    // Đếm số đơn đang giao và lịch sử (chỉ tính delivered)
    const shippingCount = await Order.countDocuments({ status: 'shipping', shiperID: req.session.user._id });
    const historyCount = orderHistory.filter(h => h.status === 'delivered').length;
    res.render('shipper/dashboard', {
        title: 'Bảng điều khiển giao hàng',
        waitingOrders,
        shippingOrders,
        deliveredOrders,
        cancelledOrders,
        totalEarnings,
        orderHistory,
        shippingCount,
        historyCount
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
        { $push: { orderHistory: {
            order: order._id,
            status: 'shipping',
            updatedAt: new Date(),
            orderAmount: order.totalAmount,
            earning: 0 // Chưa có tiền công khi mới nhận
        } } },
        { upsert: true }
    );
    res.json({ success: true });
};

// Giao thành công (shipping -> delivered)
exports.deliverOrder = async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'shipping' || String(order.shiperID) !== String(req.session.user._id)) return res.status(400).json({ success: false, message: 'Đơn không hợp lệ' });
    // Check if already delivered in history
    const shipper = await Shipper.findOne({ user: req.session.user._id });
    if (shipper && shipper.orderHistory.some(h => String(h.order) === String(orderId) && h.status === 'delivered')) {
        return res.status(400).json({ success: false, message: 'Đơn này đã được ghi nhận giao thành công.' });
    }
    order.status = 'delivered';
    order.shipDate = new Date();
    await order.save();
    // Tính tiền công
    const earning = calcShipperEarning(order.totalAmount);
    // Cộng tiền cho shipper và lưu lịch sử
    await Shipper.updateOne(
        { user: req.session.user._id },
        {
            $inc: { totalEarnings: earning },
            $push: { orderHistory: {
                order: order._id,
                status: 'delivered',
                updatedAt: order.shipDate,
                orderAmount: order.totalAmount,
                earning
            } }
        },
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
        { $push: { orderHistory: {
            order: order._id,
            status: 'cancelled',
            updatedAt: new Date(),
            orderAmount: order.totalAmount,
            earning: 0
        } } },
        { upsert: true }
    );
    res.json({ success: true });
};

// API lọc lịch sử giao hàng theo trạng thái (AJAX)
exports.filterOrderHistory = async (req, res) => {
    const { status } = req.query;
    const shipper = await Shipper.findOne({ user: req.session.user._id });
    let history = shipper ? shipper.orderHistory : [];
    if (status && status !== 'all') {
        history = history.filter(h => h.status === status);
    }
    res.json({ success: true, history });
};

// API trả về dữ liệu earnings theo thời gian cho biểu đồ
exports.earningsChartData = async (req, res) => {
    const shipper = await Shipper.findOne({ user: req.session.user._id });
    const history = shipper ? shipper.orderHistory : [];
    // Gom earnings theo ngày
    const chartData = {};
    history.forEach(h => {
        if (h.status === 'delivered') {
            const date = h.updatedAt.toISOString().slice(0, 10); // yyyy-mm-dd
            chartData[date] = (chartData[date] || 0) + (h.earning || 0);
        }
    });
    res.json({ success: true, chartData });
};

exports.getOrdersPage = async (req, res) => {
    const waitingOrders = await Order.find({ status: 'waiting' }).lean();
    res.render('shipper/orders', {
        title: 'Đơn có thể nhận',
        currentUser: req.session.user,
        waitingOrders
    });
};

exports.getShippingPage = async (req, res) => {
    const shippingOrders = await Order.find({ status: 'shipping', shiperID: req.session.user._id }).lean();
    res.render('shipper/shipping', {
        title: 'Đơn đang giao',
        currentUser: req.session.user,
        shippingOrders
    });
};

exports.getHistoryPage = async (req, res) => {
    // Lấy lịch sử từ orderHistory của shipper, populate sang Order
    const shipper = await Shipper.findOne({ user: req.session.user._id }).populate({
        path: 'orderHistory.order',
        model: 'Order'
    });
    let deliveredHistory = (shipper && shipper.orderHistory)
        ? shipper.orderHistory.filter(h => h.status === 'delivered')
        : [];
    // Lọc trùng orderId, chỉ lấy entry delivered mới nhất cho mỗi order
    const uniqueMap = new Map();
    deliveredHistory.forEach(h => {
        if (!h.order || !h.order._id) return;
        const key = String(h.order._id);
        if (!uniqueMap.has(key) || uniqueMap.get(key).updatedAt < h.updatedAt) {
            uniqueMap.set(key, h);
        }
    });
    deliveredHistory = Array.from(uniqueMap.values());
    // Sắp xếp mới nhất lên đầu
    deliveredHistory.sort((a, b) => b.updatedAt - a.updatedAt);
    res.render('shipper/history', {
        title: 'Lịch sử đơn đã giao',
        currentUser: req.session.user,
        deliveredHistory
    });
};