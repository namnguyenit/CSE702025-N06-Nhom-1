// user/middlewares/authMiddleware.js

// Kiểm tra xem người dùng đã đăng nhập chưa
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục.' });
    }
    req.flash('error_msg', 'Vui lòng đăng nhập để tiếp tục.');
    res.redirect('/auth/login');
};

// Kiểm tra xem người dùng chưa đăng nhập (dùng cho trang login, register)
exports.isLoggedOut = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(400).json({ success: false, message: 'Bạn đã đăng nhập.' });
    }
    res.redirect('/'); // Hoặc trang profile nếu muốn
};

// Kiểm tra vai trò User (cho các chức năng chỉ user thường mới làm được)
exports.isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    }
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập vào mục này.' });
    }
    req.flash('error_msg', 'Bạn không có quyền truy cập vào mục này.');
    res.redirect('/');
};


// Kiểm tra vai trò Shipper
exports.isShipper = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Shipper') {
        return next();
    }
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập. Chức năng này dành cho nhân viên giao hàng.' });
    }
    req.flash('error_msg', 'Bạn không có quyền truy cập. Chức năng này dành cho nhân viên giao hàng.');
    if (req.session.user) {
        res.redirect('/'); // Nếu đã login nhưng không phải Shipper
    } else {
        res.redirect('/auth/login'); // Nếu chưa login
    }
};

// Kiểm tra vai trò Admin (ít dùng trong user app, nhưng có thể cần)
exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập vào mục này.' });
    }
    req.flash('error_msg', 'Bạn không có quyền truy cập vào mục này.');
    res.redirect('/');
};