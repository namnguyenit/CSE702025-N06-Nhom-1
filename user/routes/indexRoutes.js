const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// GET / - Trang chủ
router.get('/', pageController.getHomePage);

// GET /contact - Trang liên hệ
router.get('/contact', pageController.getContactPage);

// GET /about - Trang giới thiệu (nếu có)
router.get('/about', pageController.getAboutPage);

// GET /elements - Trang elements (nếu có từ template)
router.get('/elements', pageController.getElementsPage);


module.exports = router;