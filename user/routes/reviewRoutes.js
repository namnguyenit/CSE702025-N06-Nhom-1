const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Lấy tất cả đánh giá cho sản phẩm theo _id (ưu tiên)
router.get('/:productId', reviewController.getReviews);
// Lấy đánh giá theo tên (backward compatibility)
router.get('/by-name/:productName', reviewController.getReviews);
// Gửi đánh giá mới theo _id (ưu tiên)
router.post('/:productId', reviewController.addReview);
// Gửi đánh giá mới theo tên (backward compatibility)
router.post('/by-name/:productName', reviewController.addReview);

module.exports = router;