const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator'); // Dùng để validate input
const { isLoggedIn, isLoggedOut } = require('../middlewares/authMiddleware');

// GET /auth/login - Trang đăng nhập
router.get('/login', isLoggedOut, authController.getLoginPage);

// POST /auth/login - Xử lý đăng nhập
router.post('/login', isLoggedOut, [
    check('account', 'Tài khoản không được để trống').not().isEmpty(),
    check('password', 'Mật khẩu không được để trống').not().isEmpty()
], authController.postLogin);

// GET /auth/register - Trang đăng ký
router.get('/register', isLoggedOut, authController.getRegisterPage);

// POST /auth/register - Xử lý đăng ký
router.post('/register', isLoggedOut, [
    check('name', 'Họ tên không được để trống').not().isEmpty().trim().escape(),
    check('account', 'Tên đăng nhập không được để trống và ít nhất 3 ký tự').isLength({ min: 3 }).trim().escape(),
    check('gmail', 'Email không hợp lệ').isEmail().normalizeEmail(),
    check('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({ min: 6 }),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Mật khẩu xác nhận không khớp');
        }
        return true;
    })
], authController.postRegister);

// GET /auth/logout - Xử lý đăng xuất
router.get('/logout', isLoggedIn, authController.getLogout);
// POST /auth/logout - Xử lý đăng xuất từ form
router.post('/logout', isLoggedIn, authController.postLogout);

// GET /auth/profile - Trang thông tin cá nhân (Ví dụ)
router.get('/profile', isLoggedIn, authController.getUserProfilePage);
// POST /auth/profile - Cập nhật thông tin cá nhân (Ví dụ)
router.post('/profile', isLoggedIn, authController.postUpdateUserProfile);

// Đăng nhập dành cho shipper
router.get('/shipper-login', isLoggedOut, authController.getShipperLoginPage);
router.post('/shipper-login', isLoggedOut, [
    check('account', 'Tài khoản không được để trống').not().isEmpty(),
    check('password', 'Mật khẩu không được để trống').not().isEmpty()
], authController.postShipperLogin);


module.exports = router;