const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

exports.quickOrder = async (req, res, next) => {
    try {
        // Lấy thông tin từ form checkout
        const userId = req.session.user ? req.session.user._id : null;
        const { firstName, lastName, address, phone, email } = req.body;
        if (!userId) return res.redirect('/auth/login');
        const user = await User.findById(userId).populate('carts.productID');
        if (!user || !user.carts.length) return res.redirect('/cart');
        // Tạo shippingAddress object
        const shippingAddress = {
            fullName: `${firstName} ${lastName}`.trim(),
            address,
            phone,
            email
        };
        // Chuẩn bị items cho order
        const items = user.carts.map(item => ({
            product: item.productID._id,
            group: item.productID.type || '',
            idSP: item.productID._id.toString(),
            name: item.productID.name,
            price: item.productID.detail[0]?.price || 0,
            quantity: item.orderNumber,
            size: item.productID.detail[0]?.size || '',
            image: item.productID.image && item.productID.image.imageData ? `data:${item.productID.image.imageType};base64,${item.productID.image.imageData.toString('base64')}` : '/img/default-product.png'
        }));
        // Tính tổng tiền
        const totalAmount = items.reduce((sum, item) => sum + (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity, 0);
        // Tạo đơn hàng
        const order = new Order({
            user: userId,
            items,
            totalAmount,
            shippingAddress,
            status: 'pending',
            paymentMethod: 'COD',
            paymentStatus: 'chưa thanh toán'
        });
        await order.save();
        // Thêm order vào user.orders, xóa giỏ hàng
        user.orders.push(order._id);
        user.carts = [];
        await user.save();
        // Chuyển hướng về trang lịch sử mua hàng sau khi đặt hàng thành công
        return res.redirect('/order/history');
    } catch (err) {
        next(err);
    }
};

exports.checkoutPage = async (req, res, next) => {
    try {
        const orderId = req.query.orderId;
        if (!orderId) return res.status(400).render('pages/500', { title: 'Lỗi', message: 'Không tìm thấy đơn hàng', error: {} });
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) return res.status(404).render('pages/404', { title: 'Không tìm thấy đơn hàng' });
        res.render('pages/order_confirmation', { title: 'Xác nhận đơn hàng', order });
    } catch (err) {
        next(err);
    }
};

exports.getOrderHistory = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate({
            path: 'orders',
            populate: { path: 'items.product' }
        });
        res.render('pages/order_history', { orders: user.orders });
    } catch (err) {
        next(err);
    }
};
