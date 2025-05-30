const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

exports.quickOrder = async (req, res, next) => {
    try {
        const { name, type, size, price, quantity, image, shippingAddress } = req.body;
        // Nếu có user đăng nhập thì lấy user, nếu không thì để null hoặc xử lý guest checkout
        const user = req.session.user ? req.session.user._id : null;
        // Tìm sản phẩm để lấy id
        const product = await Product.findOne({ name, type });
        if (!product) return res.status(400).json({ message: 'Không tìm thấy sản phẩm.' });
        // Tạo đơn hàng
        const order = new Order({
            user,
            items: [{
                product: product._id,
                group: type,
                idSP: product._id.toString(),
                name,
                price,
                quantity,
                size,
                image
            }],
            totalAmount: price * quantity,
            shippingAddress,
            status: 'chờ duyệt',
            paymentMethod: 'COD',
            paymentStatus: 'chưa thanh toán'
        });
        await order.save();
        // Chuyển hướng sang trang thanh toán thành công hoặc trang cảm ơn
        res.json({ success: true, orderId: order._id });
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
