const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        const { productID, orderNumber } = req.body;
        const user = await User.findById(userId);
        // Nếu sản phẩm đã có trong giỏ thì cộng dồn số lượng
        const cartItem = user.carts.find(item => item.productID.toString() === productID);
        if (cartItem) {
            cartItem.orderNumber += orderNumber;
        } else {
            user.carts.push({ productID, orderNumber });
        }
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Lấy giỏ hàng của user
exports.getCart = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('carts.productID');
        // Chuyển đổi carts thành dạng cart.items và tính tổng giá trị
        const items = await Promise.all(user.carts.map(async item => {
            const product = item.productID;
            // Đảm bảo price là số
            let price = product.detail[0]?.price || 0;
            if (typeof price === 'string') price = parseFloat(price) || 0;
            return {
                product: product._id,
                name: product.name,
                image: product.image && product.image.imageData ? `data:${product.image.imageType};base64,${product.image.imageData.toString('base64')}` : '/img/default-product.png',
                price: price,
                qty: item.orderNumber,
                countInStock: product.detail[0]?.stock || 0
            };
        }));
        const itemsPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const shippingPrice = itemsPrice > 0 ? 2 : 0;
        const taxPrice = 0;
        const cart = {
            items,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice: itemsPrice + shippingPrice + taxPrice
        };
        res.render('pages/cart', { cart });
    } catch (err) {
        next(err);
    }
};

// Thanh toán toàn bộ giỏ hàng
exports.checkoutCart = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('carts.productID');
        if (!user.carts.length) return res.redirect('/cart');
        // Tính tổng tiền
        let totalAmount = 0;
        user.carts.forEach(item => {
            const price = item.productID.detail[0]?.price || 0;
            totalAmount += price * item.orderNumber;
        });
        // Tạo order
        const order = new Order({
            user: userId,
            items: user.carts.map(item => ({
                productID: item.productID._id,
                productNumber: item.orderNumber
            })),
            totalAmount,
            status: 'chờ duyệt',
            shipAddress: user.address
        });
        await order.save();
        // Thêm order vào user.orders
        user.orders.push(order._id);
        user.carts = [];
        await user.save();
        res.redirect('/orders/history');
    } catch (err) {
        next(err);
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { productId, qty } = req.body;
        if (!productId || !qty || qty < 1) return res.json({ success: false, message: 'Dữ liệu không hợp lệ' });
        const user = await User.findById(userId);
        const cartItem = user.carts.find(item => item.productID.toString() === productId);
        if (!cartItem) return res.json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ' });
        cartItem.orderNumber = qty;
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { productId } = req.body;
        if (!productId) return res.json({ success: false, message: 'Thiếu productId' });
        const user = await User.findById(userId);
        const prevLength = user.carts.length;
        user.carts = user.carts.filter(item => item.productID.toString() !== productId);
        if (user.carts.length === prevLength) return res.json({ success: false, message: 'Không tìm thấy sản phẩm để xóa' });
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
