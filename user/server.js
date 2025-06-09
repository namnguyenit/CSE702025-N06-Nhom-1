require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const flash = require('connect-flash'); // Thêm flash

const connectDB = require('./config/database');

// Import Routes
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Sẽ thêm
const cartRoutes = require('./routes/cartRoutes'); // Sẽ thêm
const shipperRoutes = require('./routes/shipperRoutes'); // Sẽ thêm
const reviewRoutes = require('./routes/reviewRoutes'); // Thêm reviewRoutes

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true, // Nên là true để flash hoạt động ngay cả khi chưa login
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'user_app_sessions', // Đặt tên cho collection session
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
        // secure: process.env.NODE_ENV === 'production', // Bật ở production
        // httpOnly: true
    }
}));

// Flash messages middleware
app.use(flash());

// Global variables for views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user; // Thông tin user đã đăng nhập
    res.locals.cart = req.session.cart || [];    // Thông tin giỏ hàng từ session
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // Dùng cho lỗi validation hoặc lỗi chung
    next();
});

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes); // Route cho sản phẩm
app.use('/order', orderRoutes); // Route cho đặt hàng (đúng path)
// app.use('/orders', orderRoutes); // Xóa hoặc comment dòng này nếu có
app.use('/cart', cartRoutes);
app.use('/shipper', shipperRoutes);
app.use('/review', reviewRoutes); // Thêm mount reviewRoutes vào app

// 404 Handler
app.use((req, res, next) => {
    res.status(404).render('pages/404', { title: 'Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR HANDLER:", err.message);
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).render('pages/500', {
        title: 'Lỗi Hệ Thống',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Có lỗi xảy ra, vui lòng thử lại sau.',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(PORT, () => {
    console.log(`User app server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
});