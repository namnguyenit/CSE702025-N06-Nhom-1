// user/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products - Trang danh sách tất cả sản phẩm (hoặc lọc theo category, có sắp xếp)
router.get('/', productController.getProductListPage);

// GET /products/search - Trang kết quả tìm kiếm sản phẩm
router.get('/search', productController.searchProductsPage); // Route mới cho tìm kiếm
// API gợi ý sản phẩm cho tìm kiếm nhanh
router.get('/search', productController.suggestProducts);

// GET /products/:name - Trang chi tiết sản phẩm (dùng name)
router.get('/:name', productController.getProductDetailPage);


router.get('/image/:id', productController.getProductImage);

// Thêm/xóa sản phẩm vào wishlist (AJAX)
router.post('/wishlist/toggle', require('../middlewares/authMiddleware').isLoggedIn, productController.toggleWishlist);
router.get('/category/:id', productController.getCategoryProductsPage);
module.exports = router;