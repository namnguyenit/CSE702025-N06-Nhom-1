const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.get('/checkout', async (req, res) => {
    try {
        if (req.query.buyNow === '1') {
            // Lấy thông tin sản phẩm từ query
            const { productId, name, type, size, price, qty } = req.query;
            // Tìm sản phẩm trong DB để lấy ảnh, kiểm tra tồn tại
            let product = null;
            let image = '/img/product-placeholder.png';
            if (productId) {
                product = await require('../models/ProductModel').findById(productId);
                if (product && product.image && product.image.imageData && product.image.imageType) {
                    image = `data:${product.image.imageType};base64,${product.image.imageData.toString('base64')}`;
                }
            }
            // Tạo object giống cart item
            const cart = [{
                product: {
                    _id: productId,
                    name: name || (product && product.name) || '',
                    type: type || (product && product.type) || '',
                    detail: [{ price: price, size: size }],
                    image: image
                },
                quantity: parseInt(qty) || 1
            }];
            const cartTotal = (parseFloat(price) || 0) * (parseInt(qty) || 1);
            return res.render('pages/checkout', { title: 'Thanh toán', cart, cartTotal, buyNow: true });
        }
        const userId = req.session.user._id;
        const user = await require('../models/UserModel').findById(userId).populate('carts.productID');
        const cart = user.carts.map(item => {
            let image = '/img/product-placeholder.png';
            if (item.productID.image && item.productID.image.imageData && item.productID.image.imageType) {
                image = `data:${item.productID.image.imageType};base64,${item.productID.image.imageData.toString('base64')}`;
            }
            return {
                product: {
                    ...item.productID.toObject(),
                    image: image
                },
                quantity: item.orderNumber
            };
        });
        const cartTotal = cart.reduce((sum, item) => {
            let price = 0;
            if (item.product && item.product.detail && item.product.detail[0]) {
                price = typeof item.product.detail[0].price === 'string' ? parseFloat(item.product.detail[0].price) : item.product.detail[0].price;
            }
            return sum + (price * item.quantity);
        }, 0);
        res.render('pages/checkout', { title: 'Thanh toán', cart, cartTotal, buyNow: false });
    } catch (err) {
        res.render('pages/checkout', { title: 'Thanh toán', cart: [], cartTotal: 0, buyNow: false });
    }
});
router.post('/checkout', cartController.checkoutCart);
router.post('/update', cartController.updateCartItem);
router.post('/remove', cartController.removeFromCart);

module.exports = router;
