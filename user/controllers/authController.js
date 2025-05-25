// user/controllers/authController.js
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getLoginPage = async (req, res, next) => {
    try {
        console.log('GET /auth/login');
        const categories = await Category.find({}); 
        res.render('pages/login', {
            title: 'Đăng Nhập',
            path: '/login',
            categories,
            oldInput: { email: "" }
        });
    } catch (err) {
        console.error('Lỗi getLoginPage:', err);
        next(err);
    }
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    const categories = await Category.find({});
    console.log('POST /auth/login', { email });

    if (!errors.isEmpty()) {
        console.log('Lỗi validate login:', errors.array());
        return res.status(422).render('pages/login', {
            title: 'Đăng Nhập',
            path: '/login',
            categories,
            error_msg: errors.array()[0].msg, 
            errors: errors.array(),
            oldInput: { email }
        });
    }

    try {
        const user = await User.findOne({ email }).select('+password'); 
        if (!user) {
            console.log('Không tìm thấy user:', email);
            req.flash('error_msg', 'Email hoặc mật khẩu không đúng.');
            return res.redirect('/auth/login');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Sai mật khẩu cho user:', email);
            req.flash('error_msg', 'Email hoặc mật khẩu không đúng.');
            return res.redirect('/auth/login');
        }

        if (!user.active) {
            console.log('Tài khoản bị khóa:', email);
            req.flash('error_msg', 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
            return res.redirect('/auth/login');
        }

        const userSessionData = user.toObject();
        delete userSessionData.password;

        req.session.user = userSessionData;
        req.session.isLoggedIn = true;

        req.flash('success_msg', 'Đăng nhập thành công!');
        console.log('Đăng nhập thành công:', email, 'role:', user.role);

        if (user.role === 'shipper') {
            return res.redirect('/shipper/dashboard'); 
        } else if (user.role === 'admin') {
            return res.redirect('/');
        }
        res.redirect('/');

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
            oldInput: { fullName: "", username: "", email: "" }
        });
    } catch (err) {
        console.error('Lỗi getRegisterPage:', err);
        next(err);
    }
};

exports.postRegister = async (req, res, next) => {
    const { fullName, username, email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    const categories = await Category.find({});
    console.log('POST /auth/register', { fullName, username, email });

    if (!errors.isEmpty()) {
        console.log('Lỗi validate register:', errors.array());
        return res.status(422).render('pages/register', {
            title: 'Đăng Ký',
            path: '/register',
            categories,
            error_msg: errors.array()[0].msg,
            errors: errors.array(),
            oldInput: { fullName, username, email }
        });
    }

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            let msg = '';
            if (user.email === email) msg = 'Email đã tồn tại.';
            else if (user.username === username) msg = 'Tên đăng nhập đã tồn tại.';
            
            console.log('Tồn tại user:', msg, { email, username });
            req.flash('error_msg', msg);
            return res.status(400).render('pages/register', {
                title: 'Đăng Ký',
                path: '/register',
                categories,
                error_msg: msg,
                errors: [{msg: msg}], 
                oldInput: { fullName, username, email }
            });
        }

        user = new User({
            fullName,
            username,
            email,
            password,
        
        });
        await user.save();

        console.log('Đăng ký thành công:', email);
        req.flash('success_msg', 'Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        res.redirect('/auth/login');

    } catch (err) {
        if (err.code === 11000) {
             console.log('Lỗi duplicate key:', err);
             req.flash('error_msg', 'Email hoặc Tên đăng nhập đã tồn tại.');
             return res.status(400).render('pages/register', {
                title: 'Đăng Ký',
                path: '/register',
                categories,
                error_msg: 'Email hoặc Tên đăng nhập đã tồn tại.',
                errors: [{msg: 'Email hoặc Tên đăng nhập đã tồn tại.'}],
                oldInput: { fullName, username, email }
            });
        }
        console.error('Lỗi postRegister:', err);
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


const Category = require('../models/CategoryModel'); // Đã import ở trên

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