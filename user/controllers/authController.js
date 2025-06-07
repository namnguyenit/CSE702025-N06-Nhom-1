// user/controllers/authController.js
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Category = require('../models/CategoryModel'); // Đã import ở trên

exports.getLoginPage = async (req, res, next) => {
    try {
        console.log('GET /auth/login');
        const categories = await Category.find({}); 
        res.render('pages/login', {
            title: 'Đăng Nhập',
            path: '/login',
            categories,
            oldInput: { account: "" }
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

        if (user.role === 'shipper') {
            return res.redirect('/shipper/dashboard'); 
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
        res.render('pages/register', {
            title: 'Đăng Ký',
            path: '/register',
            categories,
            oldInput: {}
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
        res.render('pages/profile', {
            title: 'Thông Tin Cá Nhân',
            categories,
            profileUser: user 
        });
    } catch (err) {
        console.error('Lỗi getUserProfilePage:', err);
        next(err);
    }
};

exports.postUpdateUserProfile = async (req, res, next) => {
    const { fullName, phone, address_street, address_city } = req.body;
    // Thêm validation nếu cần
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            req.flash('error_msg', 'Người dùng không tồn tại.');
            return res.redirect('/auth/profile');
        }

        user.fullName = fullName || user.fullName;
        user.phone = phone || user.phone;
        user.address.street = address_street || user.address.street;
        user.address.city = address_city || user.address.city;
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