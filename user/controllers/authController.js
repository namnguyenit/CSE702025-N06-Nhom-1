// user/controllers/authController.js
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Category = require('../models/CategoryModel'); // Đã import ở trên
const Shipper = require('../models/ShipperModel');

exports.getLoginPage = async (req, res, next) => {
    try {
        console.log('GET /auth/login');
        const categories = await Category.find({}); 
        let wishlistCount = 0;
        let cartCount = 0;
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            wishlistCount = user && user.wishlist ? user.wishlist.length : 0;
            cartCount = user && user.carts ? user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0) : 0;
        }
        res.render('pages/login', {
            title: 'Đăng Nhập',
            path: '/login',
            categories,
            oldInput: { account: "" },
            wishlistCount,
            cartCount
        });
    } catch (err) {
        console.error('Lỗi getLoginPage:', err);
        next(err);
    }
};

exports.postLogin = async (req, res, next) => {
    const { account, password } = req.body;
    const errors = validationResult(req);
    const categories = await Category.find({});
    console.log('POST /auth/login', { account });

    if (!errors.isEmpty()) {
        console.log('Lỗi validate login:', errors.array());
        return res.status(422).render('pages/login', {
            title: 'Đăng Nhập',
            path: '/login',
            categories,
            error_msg: errors.array()[0].msg, 
            errors: errors.array(),
            oldInput: { account }
        });
    }

    try {
        // Cho phép đăng nhập bằng account hoặc gmail
        const user = await User.findOne({ $or: [ { account }, { gmail: account } ] });
        if (!user) {
            console.log('Không tìm thấy user:', account);
            req.flash('error_msg', 'Tài khoản hoặc mật khẩu không đúng.');
            return res.redirect('/auth/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Sai mật khẩu cho user:', account);
            req.flash('error_msg', 'Tài khoản hoặc mật khẩu không đúng.');
            return res.redirect('/auth/login');
        }

        req.session.user = user;
        req.session.isLoggedIn = true;

        req.flash('success_msg', 'Đăng nhập thành công!');
        console.log('Đăng nhập thành công:', account, 'role:', user.role);

        if (user.role === 'Shipper') {
            // Chỉ chuyển thông tin cá nhân sang model Shipper nếu chưa có
            let shipper = await Shipper.findOne({ user: user._id });
            if (!shipper) {
                await Shipper.create({ user: user._id });
            }
            req.session.destroy(() => {
                res.render('pages/shipper_blocked', { title: 'Tài khoản Shipper', message: 'Tài khoản này đã được chuyển sang Shipper. Vui lòng đăng nhập ở khu vực dành cho Shipper hoặc liên hệ Admin.' });
            });
            return;
        } else if (user.role === 'admin') {
            return res.redirect('/');
        }
        // Redirect to homepage with login_success=1 for popup
        return res.redirect('/?login_success=1');

    } catch (err) {
        console.error('Lỗi postLogin:', err);
        next(err);
    }
};

exports.getRegisterPage = async (req, res, next) => {
    try {
        console.log('GET /auth/register');
        const categories = await Category.find({});
        let wishlistCount = 0;
        let cartCount = 0;
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            wishlistCount = user && user.wishlist ? user.wishlist.length : 0;
            cartCount = user && user.carts ? user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0) : 0;
        }
        res.render('pages/register', {
            title: 'Đăng Ký',
            path: '/register',
            categories,
            oldInput: {},
            wishlistCount,
            cartCount
        });
    } catch (err) {
        console.error('Lỗi getRegisterPage:', err);
        next(err);
    }
};

exports.postRegister = async (req, res, next) => {
    const { account, password, confirmPassword, name, gmail } = req.body;
    const errors = validationResult(req);
    const categories = await Category.find({});
    console.log('POST /auth/register', { account, name, gmail });

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
        return res.status(422).render('pages/register', {
            title: 'Đăng Ký',
            path: '/register',
            categories,
            error_msg: 'Mật khẩu và xác nhận mật khẩu không khớp.',
            errors: [{ msg: 'Mật khẩu và xác nhận mật khẩu không khớp.' }],
            oldInput: { account, name, gmail }
        });
    }

    if (!errors.isEmpty()) {
        console.log('Lỗi validate register:', errors.array());
        return res.status(422).render('pages/register', {
            title: 'Đăng Ký',
            path: '/register',
            categories,
            error_msg: errors.array()[0].msg,
            errors: errors.array(),
            oldInput: { account, name, gmail }
        });
    }

    try {
        const existing = await User.findOne({ $or: [ { account }, { gmail } ] });
        if (existing) {
            req.flash('error_msg', 'Tài khoản hoặc email đã tồn tại.');
            return res.redirect('/auth/register');
        }
        const hash = await bcrypt.hash(password, 10);
        // Chỉ lưu các trường cần thiết, các trường khác để trống hoặc mặc định
        const user = new User({ account, password: hash, name, gmail });
        await user.save();
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

exports.getUserProfilePage = async (req, res, next) => {
    try {
        console.log('GET /auth/profile', { userId: req.session.user && req.session.user._id });
        const categories = await Category.find({});
        const user = await User.findById(req.session.user._id);
        if (!user) {
            console.log('Không tìm thấy user khi vào profile');
            req.flash('error_msg', 'Không tìm thấy người dùng.');
            return res.redirect('/');
        }
        let wishlistCount = 0;
        let cartCount = 0;
        if (req.session.user) {
            wishlistCount = user && user.wishlist ? user.wishlist.length : 0;
            cartCount = user && user.carts ? user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0) : 0;
        }
        res.render('pages/profile', {
            title: 'Thông Tin Cá Nhân',
            categories,
            profileUser: user,
            wishlistCount,
            cartCount
        });
    } catch (err) {
        console.error('Lỗi getUserProfilePage:', err);
        next(err);
    }
};

exports.postUpdateUserProfile = async (req, res, next) => {
    const { fullName, phone, address } = req.body;
    // Thêm validation nếu cần
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            req.flash('error_msg', 'Người dùng không tồn tại.');
            return res.redirect('/auth/profile');
        }

        user.fullName = fullName || user.fullName;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        // Cập nhật các trường khác nếu có

        await user.save();

        // Cập nhật lại session user
        const userSessionData = user.toObject();
        delete userSessionData.password;
        req.session.user = userSessionData;

        req.flash('success_msg', 'Cập nhật thông tin thành công!');
        res.redirect('/auth/profile');
    } catch (err) {
        next(err);
    }
};

exports.getShipperLoginPage = async (req, res, next) => {
    try {
        res.render('pages/shipper_login', {
            title: 'Đăng Nhập Shipper',
            path: '/auth/shipper-login',
            error_msg: '',
            oldInput: { account: '' }
        });
    } catch (err) {
        next(err);
    }
};

exports.postShipperLogin = async (req, res, next) => {
    const { account, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('pages/shipper_login', {
            title: 'Đăng Nhập Shipper',
            path: '/auth/shipper-login',
            error_msg: errors.array()[0].msg,
            oldInput: { account }
        });
    }
    try {
        const user = await User.findOne({ $or: [ { account }, { gmail: account } ] });
        if (!user || user.role !== 'Shipper') {
            return res.render('pages/shipper_login', {
                title: 'Đăng Nhập Shipper',
                path: '/auth/shipper-login',
                error_msg: 'Tài khoản không tồn tại hoặc không phải là shipper.',
                oldInput: { account }
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('pages/shipper_login', {
                title: 'Đăng Nhập Shipper',
                path: '/auth/shipper-login',
                error_msg: 'Mật khẩu không đúng.',
                oldInput: { account }
            });
        }
        req.session.user = user;
        req.session.isLoggedIn = true;
        return res.redirect('/shipper/dashboard');
    } catch (err) {
        next(err);
    }
};