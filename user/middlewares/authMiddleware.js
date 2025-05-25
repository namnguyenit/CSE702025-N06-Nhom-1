// user/middlewares/authMiddleware.js

// Kiểm tra xem người dùng đã đăng nhập chưa
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Vui lòng đăng nhập để tiếp tục.');
    res.redirect('/auth/login');
};

// Kiểm tra xem người dùng chưa đăng nhập (dùng cho trang login, register)
exports.isLoggedOut = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    res.redirect('/'); // Hoặc trang profile nếu muốn
};

// Kiểm tra vai trò User (cho các chức năng chỉ user thường mới làm được)
exports.isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    }
    req.flash('error_msg', 'Bạn không có quyền truy cập vào mục này.');
    res.redirect('/');
};


// Kiểm tra vai trò Shipper
exports.isShipper = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'shipper') {
        return next();
    }
    req.flash('error_msg', 'Bạn không có quyền truy cập. Chức năng này dành cho nhân viên giao hàng.');
    if (req.session.user) {
        res.redirect('/'); // Nếu đã login nhưng không phải shipper
    } else {
        res.redirect('/auth/login'); // Nếu chưa login
    }
};

// Kiểm tra vai trò Admin (ít dùng trong user app, nhưng có thể cần)
exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    req.flash('error_msg', 'Bạn không có quyền truy cập vào mục này.');
    res.redirect('/');
};