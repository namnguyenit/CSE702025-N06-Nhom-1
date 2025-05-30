const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Đặt hàng nhanh từ trang chi tiết sản phẩm
router.post('/quick-order', orderController.quickOrder);

router.get('/checkout', orderController.checkoutPage);

router.get('/history', require('../controllers/orderController').getOrderHistory);

module.exports = router;
