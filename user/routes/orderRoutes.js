const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Đặt hàng nhanh từ trang chi tiết sản phẩm
router.post('/quick-order', orderController.quickOrder);

router.get('/checkout', orderController.checkoutPage);

module.exports = router;
