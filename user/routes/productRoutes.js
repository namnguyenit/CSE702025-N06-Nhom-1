// user/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products - Trang danh sách tất cả sản phẩm (hoặc lọc theo category, có sắp xếp)
router.get('/', productController.getProductListPage);

// GET /products/search - Trang kết quả tìm kiếm sản phẩm
router.get('/search', productController.searchProductsPage); // Route mới cho tìm kiếm

// GET /products/:name - Trang chi tiết sản phẩm (dùng name)
router.get('/:name', productController.getProductDetailPage);


router.get('/image/:id', productController.getProductImage);

module.exports = router;