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
        res.render('pages/cart', { cart: user.carts });
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
