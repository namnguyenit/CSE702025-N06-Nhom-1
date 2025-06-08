const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

// Helper: xác định request là AJAX/fetch
function isAjax(req) {
    return (
        req.xhr ||
        (req.headers.accept && req.headers.accept.indexOf('json') > -1) ||
        (req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') > -1)
    );
}

exports.quickOrder = async (req, res, next) => {
    try {
        const userId = req.session.user ? req.session.user._id : null;
        // Nếu có trường buyNow hoặc đủ thông tin sản phẩm => MUA NGAY
        const { name, type, size, price, quantity, image, shippingAddress: shippingAddressData, productId } = req.body;
        if (!userId) {
            if (isAjax(req)) {
                return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để đặt hàng.' });
            }
            return res.redirect('/auth/login');
        }
        // Nếu có đủ thông tin sản phẩm (mua ngay)
        if (name && type && size && price && quantity) {
            // Lấy đúng ảnh biến thể nếu productId có trong DB
            let imageObj = null;
            if (productId) {
                const productDoc = await Product.findById(productId);
                if (productDoc && productDoc.image && productDoc.image.imageData && productDoc.image.imageType) {
                    imageObj = {
                        imageName: productDoc.image.imageName,
                        imageType: productDoc.image.imageType,
                        imageData: productDoc.image.imageData
                    };
                }
            }
            // Tạo shippingAddress cho mua ngay
            const fullName = req.body.firstName && req.body.lastName ? `${req.body.firstName} ${req.body.lastName}`.trim() : '';
            const shippingAddress = {
                fullName: fullName || (shippingAddressData && shippingAddressData.fullName) || '',
                address: req.body.address || (shippingAddressData && shippingAddressData.address) || '',
                phone: req.body.phone || (shippingAddressData && shippingAddressData.phone) || '',
                email: req.body.email || (shippingAddressData && shippingAddressData.email) || ''
            };
            const item = {
                name,
                group: type,
                idSP: productId || '',
                product: productId || undefined, // Đảm bảo đúng ObjectId nếu có
                price: typeof price === 'string' ? parseFloat(price) : price,
                quantity: typeof quantity === 'string' ? parseInt(quantity) : quantity,
                size,
                image: imageObj
            };
            const totalAmount = item.price * item.quantity;
            const order = new Order({
                user: userId,
                items: [item],
                totalAmount,
                shippingAddress,
                status: 'pending',
                paymentMethod: 'COD',
                paymentStatus: 'chưa thanh toán'
            });
            await order.save();
            // Thêm order vào user.orders, KHÔNG xóa giỏ hàng
            const user = await User.findById(userId);
            user.orders.push(order._id);
            await user.save();
            if (isAjax(req)) {
                return res.json({ success: true, orderId: order._id });
            }
            return res.redirect('/order/checkout?orderId=' + order._id);
        }
        // Nếu không phải mua ngay, giữ logic cũ: lấy từ giỏ hàng
        const user = await User.findById(userId).populate('carts.productID');
        if (!user || !user.carts.length) {
            if (isAjax(req)) {
                return res.status(400).json({ success: false, message: 'Giỏ hàng rỗng.' });
            }
            return res.redirect('/cart');
        }
        const fullName = req.body.firstName && req.body.lastName ? `${req.body.firstName} ${req.body.lastName}`.trim() : '';
        const shippingAddress = {
            fullName: fullName || (shippingAddressData && shippingAddressData.fullName) || '',
            address: req.body.address || (shippingAddressData && shippingAddressData.address) || '',
            phone: req.body.phone || (shippingAddressData && shippingAddressData.phone) || '',
            email: req.body.email || (shippingAddressData && shippingAddressData.email) || ''
        };
        const items = user.carts.map(item => {
            let imageObj = null;
            if (item.productID.image && item.productID.image.imageData && item.productID.image.imageType) {
                imageObj = {
                    imageName: item.productID.image.imageName,
                    imageType: item.productID.image.imageType,
                    imageData: item.productID.image.imageData
                };
            }
            return {
                product: item.productID._id,
                group: item.productID.type || '',
                idSP: item.productID._id.toString(),
                name: item.productID.name,
                price: item.productID.detail.find(d => d.size === item.size)?.price || item.productID.detail[0]?.price || 0,
                quantity: item.orderNumber,
                size: item.size,
                image: imageObj
            };
        });
        const totalAmount = items.reduce((sum, item) => sum + (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity, 0);
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
        user.orders.push(order._id);
        user.carts = [];
        await user.save();
        if (isAjax(req)) {
            return res.json({ success: true, orderId: order._id });
        }
        return res.redirect('/order/history');
    } catch (err) {
        if (isAjax(req)) {
            return res.status(500).json({ success: false, message: err.message || 'Đặt hàng thất bại.' });
        }
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
