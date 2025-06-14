// user/routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const orderController = require('../controllers/orderController');
// const { isAuthenticated, isGuest } = require('../middlewares/authMiddleware'); // Nếu bạn dùng

// GET / - Trang chủ
router.get('/', pageController.getHomePage);

// GET /contact - Trang liên hệ
router.get('/contact', pageController.getContactPage);

// GET /about - Trang giới thiệu
router.get('/about', pageController.getAboutPage);

// GET /elements - Trang elements
router.get('/elements', pageController.getElementsPage);

// POST /subscribe - Xử lý đăng ký nhận bản tin
router.post('/subscribe', pageController.handleSubscription); // Route mới cho form đăng ký

// GET /history - Lịch sử mua hàng
router.get('/history', orderController.getOrderHistory);

// Trang wishlist
const { getWishlistPage } = require('../controllers/pageController');
router.get('/wishlist', getWishlistPage);

// Trang chính sách đổi trả (tĩnh, không cần controller riêng)
router.get('/return-policy', (req, res) => {
    res.render('pages/return-policy', { title: 'Chính Sách Đổi Trả' });
});

// Các route khác cho các trang tĩnh (ví dụ)
// router.get('/faq', pageController.getFaqPage);
// router.get('/terms', pageController.getTermsPage);
// router.get('/privacy', pageController.getPrivacyPage);

module.exports = router;