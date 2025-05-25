// user/controllers/pageController.js
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');

exports.getHomePage = async (req, res, next) => {
    try {
        console.log('GET / - Trang chủ');
        const popularProducts = await Product.find({}) // Lấy một vài sản phẩm nổi bật/mới nhất
            .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
            .limit(8) // Giới hạn 8 sản phẩm
            .populate('category'); // Lấy thông tin category

        const categories = await Category.find({});
        console.log('Dữ liệu render index:', { popularProductsCount: popularProducts.length, categoriesCount: categories.length });
        res.render('pages/index', {
            title: 'Trang Chủ',
            popularProducts,
            categories
        });
    } catch (err) {
        console.error('Lỗi getHomePage:', err);
        next(err); // Chuyển lỗi cho global error handler
    }
};

exports.getContactPage = async (req, res, next) => {
    try {
        console.log('GET /contact');
        const categories = await Category.find({});
        res.render('pages/contact', {
            title: 'Liên Hệ',
            categories
        });
    } catch (err) {
        console.error('Lỗi getContactPage:', err);
        next(err);
    }
};

exports.getAboutPage = async (req, res, next) => { // Nếu bạn có trang about.html
    try {
        console.log('GET /about');
        const categories = await Category.find({});
        res.render('pages/about', {
            title: 'Về Chúng Tôi',
            categories
        });
    } catch (err) {
        console.error('Lỗi getAboutPage:', err);
        next(err);
    }
};

exports.getElementsPage = async (req, res, next) => { // Nếu bạn có trang elements.html
    try {
        console.log('GET /elements');
        const categories = await Category.find({});
        res.render('pages/elements', {
            title: 'Elements',
            categories
        });
    } catch (err) {
        console.error('Lỗi getElementsPage:', err);
        next(err);
    }
};