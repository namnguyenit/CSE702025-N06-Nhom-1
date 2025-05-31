const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.get('/checkout', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await require('../models/UserModel').findById(userId).populate('carts.productID');
        const cart = user.carts.map(item => ({
            product: item.productID,
            quantity: item.orderNumber
        }));
        const cartTotal = cart.reduce((sum, item) => {
            let price = 0;
            if (item.product && item.product.detail && item.product.detail[0]) {
                price = typeof item.product.detail[0].price === 'string' ? parseFloat(item.product.detail[0].price) : item.product.detail[0].price;
            }
            return sum + (price * item.quantity);
        }, 0);
        res.render('pages/checkout', { title: 'Thanh toán', cart, cartTotal });
    } catch (err) {
        res.render('pages/checkout', { title: 'Thanh toán', cart: [], cartTotal: 0 });
    }
});
router.post('/checkout', cartController.checkoutCart);
router.post('/update', cartController.updateCartItem);
router.post('/remove', cartController.removeFromCart);

module.exports = router;
