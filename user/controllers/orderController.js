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
            // Giảm tồn kho một cách an toàn (atomic)
            const product = await Product.findOneAndUpdate(
                {
                    _id: productId,
                    type: type,
                    "detail.size": size,
                    "detail.stock": { $gte: quantity }
                },
                { $inc: { "detail.$.stock": -quantity } },
                { new: true }
            );
            if (!product) {
                return isAjax(req)
                    ? res.status(400).json({ success: false, message: 'Sản phẩm không đủ tồn kho hoặc đã hết hàng.' })
                    : res.redirect('/cart?error=outofstock');
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
        // Bắt đầu transaction giảm tồn kho cho từng sản phẩm trong giỏ
        // Bỏ transaction/session để chạy với MongoDB standalone
        try {
            const updatedProducts = [];
            for (const item of user.carts) {
                const updated = await Product.findOneAndUpdate(
                    {
                        _id: item.productID._id,
                        type: item.type,
                        "detail.size": item.size,
                        "detail.stock": { $gte: item.orderNumber }
                    },
                    { $inc: { "detail.$.stock": -item.orderNumber } },
                    { new: true }
                );
                if (!updated) {
                    // Rollback (giả lập): báo lỗi và dừng
                    return isAjax(req)
                        ? res.status(400).json({ success: false, message: `Sản phẩm ${item.productID.name} (${item.size}) không đủ tồn kho.` })
                        : res.redirect('/cart?error=outofstock');
                }
                updatedProducts.push(updated);
            }
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
            return next(err);
        }
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
        let wishlistCount = 0;
        let cartCount = 0;
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            wishlistCount = user && user.wishlist ? user.wishlist.length : 0;
            cartCount = user && user.carts ? user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0) : 0;
        }
        res.render('pages/order_confirmation', { title: 'Xác nhận đơn hàng', order, wishlistCount, cartCount });
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
        let wishlistCount = 0;
        let cartCount = 0;
        if (user && user.wishlist) wishlistCount = user.wishlist.length;
        if (user && user.carts) cartCount = user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0);
        res.render('pages/order_history', { orders: user.orders, wishlistCount, cartCount });
    } catch (err) {
        next(err);
    }
};

// Hủy đơn hàng (user)
exports.cancelOrder = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user._id;
        const { orderId } = req.body;
        if (!userId || !orderId) return res.status(400).json({ success: false, message: 'Thiếu thông tin.' });
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
        if (String(order.user) !== String(userId)) return res.status(403).json({ success: false, message: 'Bạn không có quyền hủy đơn này.' });
        if (order.status !== 'pending' && order.status !== 'waiting') {
            return res.status(400).json({ success: false, message: 'Chỉ có thể hủy đơn khi đang chờ duyệt hoặc chờ giao.' });
        }
        order.status = 'cancelled';
        await order.save();
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message || 'Hủy đơn thất bại.' });
    }
};
