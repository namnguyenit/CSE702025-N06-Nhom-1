const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res, next) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để thêm vào giỏ hàng.' });
        }
        const userId = req.session.user._id;
        const { productID, orderNumber, type, size } = req.body;
        const user = await User.findById(userId);
        // Nếu sản phẩm đã có trong giỏ (cùng productID, type, size) thì cộng dồn số lượng
        const cartItem = user.carts.find(item => item.productID.toString() === productID && item.type === type && item.size === size);
        if (cartItem) {
            cartItem.orderNumber += orderNumber;
        } else {
            user.carts.push({ productID, orderNumber, type, size });
        }
        await user.save();
        // Luôn trả về JSON cho mọi request POST /cart/add
        return res.json({ success: true, addcart_success: true });
    } catch (err) {
        return res.json({ success: false, message: err.message });
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
            let price = product.detail.find(d => d.size === item.size)?.price || product.detail[0]?.price || 0;
            if (typeof price === 'string') price = parseFloat(price) || 0;
            // Lấy đúng ảnh của biến thể (document Product)
            let image = '/img/default-product.png';
            if (product.image && product.image.imageData && product.image.imageType) {
                image = `data:${product.image.imageType};base64,${product.image.imageData.toString('base64')}`;
            }
            return {
                product: product._id,
                name: product.name,
                type: item.type,
                size: item.size,
                image: image,
                price: price,
                qty: item.orderNumber,
                countInStock: product.detail.find(d => d.size === item.size)?.stock || product.detail[0]?.stock || 0
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
        let wishlistCount = 0;
        let cartCount = 0;
        if (user && user.wishlist) wishlistCount = user.wishlist.length;
        if (user && user.carts) cartCount = user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0);
        res.render('pages/cart', { cart, wishlistCount, cartCount });
    } catch (err) {
        next(err);
    }
};

// Thanh toán toàn bộ giỏ hàng
exports.checkoutCart = async (req, res, next) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để thanh toán.' });
            }
            return res.redirect('/auth/login');
        }
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('carts.productID');
        if (!user.carts.length) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(400).json({ success: false, message: 'Giỏ hàng rỗng.' });
            }
            return res.redirect('/cart');
        }
        // Tính tổng tiền
        let totalAmount = 0;
        user.carts.forEach(item => {
            const price = item.productID.detail[0]?.price || 0;
            totalAmount += price * item.orderNumber;
        });
        // Tạo order
        const order = new Order({
            user: userId,
            items: user.carts.map(item => {
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
                    name: item.productID.name,
                    type: item.type,
                    size: item.size,
                    price: item.productID.detail.find(d => d.size === item.size)?.price || item.productID.detail[0]?.price || 0,
                    quantity: item.orderNumber,
                    image: imageObj
                };
            }),
            totalAmount,
            status: 'pending',
            shipAddress: user.address
        });
        await order.save();
        // Thêm order vào user.orders
        user.orders.push(order._id);
        user.carts = [];
        await user.save();
        // Nếu là AJAX request, trả về JSON
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({ success: true, orderId: order._id });
        }
        // Redirect to checkout page with success param for popup
        res.redirect('/checkout?success=1');
    } catch (err) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({ success: false, message: err.message });
        }
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
        const { productId, type, size } = req.body;
        if (!productId || !type || !size) return res.json({ success: false, message: 'Thiếu thông tin sản phẩm' });
        const user = await User.findById(userId);
        const prevLength = user.carts.length;
        user.carts = user.carts.filter(item => !(item.productID.toString() === productId && item.type === type && item.size === size));
        if (user.carts.length === prevLength) return res.json({ success: false, message: 'Không tìm thấy sản phẩm để xóa' });
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
