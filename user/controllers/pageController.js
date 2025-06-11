// user/controllers/pageController.js
const Product = require('../models/ProductModel'); //
const Category = require('../models/CategoryModel'); //

exports.getHomePage = async (req, res, next) => {
    try {
        console.log('GET / - Trang chủ');
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .limit(8);

        const categories = await Category.find({});
        console.log('Dữ liệu render index:', { popularProductsCount: products.length, categoriesCount: categories.length });
        res.render('pages/index', { // Giả sử bạn có view index.ejs đã Việt hóa
            title: 'Trang Chủ',
            products,
            categories
        });
    } catch (err) {
        console.error('Lỗi getHomePage:', err);
        next(err);
    }
};

exports.getCartPage = async (req, res) => {
    try {
        // Truyền toàn bộ đối tượng cart từ session, hoặc một đối tượng cart rỗng nếu chưa có
        const sessionCart = req.session.cart || { items: [], itemsPrice: 0, taxPrice: 0, shippingPrice: 0, totalPrice: 0 };

        res.render('cart', { // Renders views/cart.ejs
            title: 'Shopping Cart',
            path: '/cart',
            user: req.user,
            cart: sessionCart // Truyền toàn bộ đối tượng cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { title: 'Error', message: 'Server Error', user: req.user, path: '/500' });
    }
};

exports.getContactPage = async (req, res, next) => {
    try {
        console.log('GET /contact');
        const categories = await Category.find({});
        res.render('pages/contact-vi', { // Giả sử có contact-vi.ejs
            title: 'Liên Hệ',
            categories
        });
    } catch (err) {
        console.error('Lỗi getContactPage:', err);
        next(err);
    }
};

exports.getAboutPage = async (req, res, next) => {
    try {
        console.log('GET /about');
        const categories = await Category.find({});
        res.render('pages/about-vi', { // Giả sử có about-vi.ejs
            title: 'Về Chúng Tôi',
            categories
        });
    } catch (err) {
        console.error('Lỗi getAboutPage:', err);
        next(err);
    }
};

exports.getElementsPage = async (req, res, next) => {
    try {
        console.log('GET /elements');
        const categories = await Category.find({});
        res.render('pages/elements-vi', { // Giả sử có elements-vi.ejs
            title: 'Thành Phần',
            categories
        });
    } catch (err) {
        console.error('Lỗi getElementsPage:', err);
        next(err);
    }
};

// Hàm mới để xử lý đăng ký nhận tin
exports.handleSubscription = async (req, res, next) => {
    try {
        const email = req.body.email; // Lấy email từ form POST
        if (email) {
            console.log(`Email đăng ký nhận tin: ${email}`);
            // TODO: Thêm logic lưu email vào cơ sở dữ liệu hoặc dịch vụ email marketing
            // Ví dụ: await Subscriber.create({ email });

            // Sau khi xử lý, bạn có thể gửi thông báo thành công hoặc chuyển hướng
            // req.flash('success_msg', 'Đăng ký nhận tin thành công!'); // Nếu dùng connect-flash
            // return res.redirect('back'); // Quay lại trang trước đó
            return res.status(200).send(`Đã nhận được email đăng ký: ${email}. Cảm ơn bạn đã đăng ký! (Đây là phản hồi mẫu, cần được hoàn thiện)`);

        } else {
            // req.flash('error_msg', 'Vui lòng nhập email.');
            // return res.redirect('back');
            return res.status(400).send('Vui lòng cung cấp địa chỉ email.');
        }
    } catch (err) {
        console.error('Lỗi xử lý đăng ký nhận tin:', err);
        // req.flash('error_msg', 'Có lỗi xảy ra, vui lòng thử lại.');
        // return res.redirect('back');
        next(err);
    }
};

// Trang wishlist
exports.getWishlistPage = async (req, res, next) => {
    try {
        if (!req.session.user) return res.redirect('/auth/login');
        const User = require('../models/UserModel');
        const Product = require('../models/ProductModel');
        const user = await User.findById(req.session.user._id);
        const categories = await Category.find({});
        const wishlistNames = user.wishlist || [];
        let wishlistProducts = [];
        if (wishlistNames.length > 0) {
            // Lấy mỗi tên chỉ 1 sản phẩm đại diện (nếu có nhiều biến thể)
            const allProducts = await Product.find({ name: { $in: wishlistNames } });
            // Đảm bảo thứ tự theo wishlist
            wishlistProducts = wishlistNames.map(name => allProducts.find(p => p.name === name)).filter(Boolean);
        }
        res.render('pages/wishlist', {
            title: 'Sản phẩm yêu thích',
            products: wishlistProducts,
            categories
        });
    } catch (err) {
        next(err);
    }
};