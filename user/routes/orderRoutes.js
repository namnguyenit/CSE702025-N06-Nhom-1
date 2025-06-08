const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Đặt hàng nhanh từ trang chi tiết sản phẩm
router.post('/quick-order', orderController.quickOrder);

// Hủy đơn hàng (user)
router.post('/cancel', orderController.cancelOrder);

router.get('/checkout', orderController.checkoutPage);

router.get('/history', require('../controllers/orderController').getOrderHistory);

module.exports = router;
