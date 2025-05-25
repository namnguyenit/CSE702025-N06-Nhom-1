const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products - Trang danh sách tất cả sản phẩm (hoặc lọc theo category)
router.get('/', productController.getProductListPage);

// GET /products/:slug - Trang chi tiết sản phẩm (sử dụng slug)
router.get('/:slug', productController.getProductDetailPage);

module.exports = router;