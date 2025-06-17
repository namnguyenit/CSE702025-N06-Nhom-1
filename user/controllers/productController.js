// user/controllers/productController.js
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const mongoose = require('mongoose');
const User = require('../models/UserModel'); // Thêm ở đầu file nếu chưa có

// Hiển thị trang danh sách sản phẩm (có lọc và sắp xếp)
exports.getProductListPage = async (req, res, next) => {
    try {
        const categoryName = req.query.category;
        const sortBy = req.query.sort;
        const keyword = req.query.keyword ? req.query.keyword.trim() : '';
        let queryConditions = {};
        let pageTitle = 'Tất Cả Sản Phẩm';
        let currentCategory = null;
        if (categoryName && categoryName !== 'all') {
            currentCategory = await Category.findOne({ name: categoryName });
            if (currentCategory) {
                queryConditions.category = currentCategory._id;
                pageTitle = currentCategory.name;
            }
        }
        if (keyword) {
            queryConditions.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
            pageTitle = `Kết quả cho "${keyword}"`;
        }
        let sortOptions = { createdAt: -1 };
        if (sortBy) {
            switch (sortBy) {
                case 'price_asc': sortOptions = { 'detail.price': 1 }; break;
                case 'price_desc': sortOptions = { 'detail.price': -1 }; break;
                case 'name_asc': sortOptions = { name: 1 }; break;
                case 'name_desc': sortOptions = { name: -1 }; break;
                case 'latest': sortOptions = { createdAt: -1 }; break;
            }
        }
        // Truy vấn sản phẩm đúng điều kiện
        const products = await Product.find(queryConditions).sort(sortOptions);
        const categories = await Category.find({}).sort({ name: 1 });
        // Nếu có keyword, chỉ gộp các sản phẩm mà name hoặc description khớp keyword
        let filteredProducts = products;
        if (keyword) {
            const regex = new RegExp(keyword, 'i');
            filteredProducts = products.filter(prod => regex.test(prod.name) || regex.test(prod.description || ''));
        }
        const groupedProducts = {};
        filteredProducts.forEach(prod => {
            if (!groupedProducts[prod.name]) {
                groupedProducts[prod.name] = {
                    _id: prod._id,
                    name: prod.name,
                    description: prod.description,
                    image: prod.image && prod.image.imageData ? `data:${prod.image.imageType};base64,${prod.image.imageData.toString('base64')}` : '/img/product-placeholder.png',
                    types: [],
                    detail: prod.detail,
                    reviewProducts: [], // sẽ tổng hợp tất cả review của các type
                    rating: 0,
                    ratingCount: 0
                };
            }
            groupedProducts[prod.name].types.push({
                type: prod.type,
                detail: prod.detail
            });
            // Gom tất cả reviewProducts của các type vào 1 mảng
            if (Array.isArray(prod.reviewProducts) && prod.reviewProducts.length > 0) {
                groupedProducts[prod.name].reviewProducts = groupedProducts[prod.name].reviewProducts.concat(prod.reviewProducts);
            }
        });
        // Tính lại rating trung bình và số lượng đánh giá cho từng sản phẩm (từ tất cả type)
        Object.values(groupedProducts).forEach(product => {
            let totalStars = 0, totalReviews = 0, avgRating = 0;
            if (Array.isArray(product.reviewProducts) && product.reviewProducts.length > 0) {
                totalReviews = product.reviewProducts.length;
                totalStars = product.reviewProducts.reduce((sum, r) => sum + (r.star || 0), 0);
                avgRating = totalStars / totalReviews;
            }
            // Làm tròn số sao: .01-.49 làm tròn xuống, .5 trở lên làm tròn lên
            let displayRating = Math.floor(avgRating + 0.5 * (avgRating % 1 >= 0.5 ? 1 : 0));
            product.rating = avgRating;
            product.displayRating = displayRating;
            product.ratingCount = totalReviews;
            console.log(`Sản phẩm: ${product.name} - Số sao trung bình: ${avgRating.toFixed(2)} (Hiển thị: ${displayRating} sao, ${totalReviews} đánh giá)`);
        });
        // Đánh dấu hết hàng nếu tất cả các biến thể đều hết stock
        Object.values(groupedProducts).forEach(product => {
            let allOut = true;
            product.types.forEach(type => {
                if (type.detail.some(d => d.stock > 0)) allOut = false;
            });
            product.isOutOfStock = allOut;
        });
        // Lấy danh sách type duy nhất từ các sản phẩm
        const typesSet = new Set();
        products.forEach(prod => {
            if (prod.type) typesSet.add(prod.type);
        });
        const types = Array.from(typesSet);
        let wishlist = [];
        let wishlistCount = 0;
        let cartCount = 0;
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            wishlistCount = user && user.wishlist ? user.wishlist.length : 0;
            cartCount = user && user.carts ? user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0) : 0;
            if (user && user.wishlist) wishlist = user.wishlist;
        }
        res.render('pages/product_list', {
            title: pageTitle,
            products: Object.values(groupedProducts),
            categories,
            currentCategory: currentCategory ? currentCategory.name : null,
            keyword, // Truyền keyword để giữ lại giá trị trong form
            wishlist, // Truyền wishlist để view không lỗi
            wishlistCount,
            cartCount
        });
    } catch (err) {
        next(err);
    }
};

// Hiển thị trang chi tiết sản phẩm (không dùng slug)
exports.getProductDetailPage = async (req, res, next) => {
    try {
        const productName = req.params.name;
        const variants = await Product.find({ name: productName });
        if (!variants || variants.length === 0) {
            const err = new Error('Sản phẩm không tồn tại');
            err.status = 404;
            return next(err);
        }
        // Gom tất cả reviewProducts của các type vào 1 mảng
        let allReviews = [];
        variants.forEach(v => {
            if (Array.isArray(v.reviewProducts) && v.reviewProducts.length > 0) {
                allReviews = allReviews.concat(v.reviewProducts);
            }
        });
        // Tính số sao trung bình và số đánh giá (dùng cùng logic với ngoài card)
        let totalStars = 0, totalReviews = 0, avgRating = 0, displayRating = 0;
        if (allReviews.length > 0) {
            totalReviews = allReviews.length;
            totalStars = allReviews.reduce((sum, r) => sum + (r.star || 0), 0);
            avgRating = totalStars / totalReviews;
            displayRating = Math.floor(avgRating + 0.5 * (avgRating % 1 >= 0.5 ? 1 : 0));
        }
        const productDetail = {
            _id: variants[0]._id,
            name: productName,
            description: variants[0].description,
            image: variants[0].image && variants[0].image.imageData ? `data:${variants[0].image.imageType};base64,${variants[0].image.imageData.toString('base64')}` : '/img/product-placeholder.png',
            types: variants.map(v => ({
                _id: v._id,
                type: v.type,
                detail: v.detail,
                image: v.image && v.image.imageData ? {
                    imageType: v.image.imageType,
                    imageData: { $binary: { base64: v.image.imageData.toString('base64') } }
                } : null
            })),
            detail: variants[0].detail,
            reviewProducts: allReviews,
            isOutOfStock: variants.every(v => v.detail.every(d => d.stock === 0)),
            rating: avgRating,
            displayRating,
            ratingCount: totalReviews
        };
        const categories = await Category.find({});
        let wishlist = [];
        let wishlistCount = 0;
        let cartCount = 0;
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            wishlistCount = user && user.wishlist ? user.wishlist.length : 0;
            cartCount = user && user.carts ? user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0) : 0;
            if (user && user.wishlist) wishlist = user.wishlist;
        }
        res.render('pages/product_detail', {
            title: productName,
            product: productDetail,
            categories,
            wishlist, // truyền wishlist cho EJS
            wishlistCount,
            cartCount
        });
    } catch (err) {
        next(err);
    }
};

// Trả về ảnh sản phẩm từ buffer
exports.getProductImage = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        // images là mảng, lấy ảnh đầu tiên
        const img = product && Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;
        if (!img || !img.imageData) {
            return res.status(404).sendFile('product-placeholder.png', { root: 'user/public/img' });
        }
        res.contentType(img.imageType || 'image/png');
        res.send(img.imageData);
    } catch (err) {
        next(err);
    }
};

// Xử lý tìm kiếm sản phẩm
exports.searchProductsPage = async (req, res, next) => {
    try {
        const searchQuery = req.query.query; // Lấy từ khóa tìm kiếm từ URL query
        let products = [];
        let pageTitle = `Kết quả tìm kiếm cho "${searchQuery}"`;

        if (searchQuery && searchQuery.trim() !== '') {
            // Sử dụng $regex để tìm kiếm không phân biệt chữ hoa/thường và một phần của từ
            // Để có tìm kiếm full-text hiệu quả hơn, cân nhắc sử dụng $text index trong MongoDB
            products = await Product.find({
                name: { $regex: searchQuery, $options: 'i' } // 'i' for case-insensitive
                // Bạn có thể mở rộng tìm kiếm cho các trường khác như description, tags, etc.
                // { $or: [ { name: { $regex: searchQuery, $options: 'i' } }, { description: { $regex: searchQuery, $options: 'i' } } ] }
            }).sort({ createdAt: -1 }); // Sắp xếp kết quả
        } else {
            pageTitle = "Vui lòng nhập từ khóa để tìm kiếm";
        }

        const categories = await Category.find({}).sort({ name: 1 });
        let wishlistCount = 0;
        let cartCount = 0;
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            wishlistCount = user && user.wishlist ? user.wishlist.length : 0;
            cartCount = user && user.carts ? user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0) : 0;
        }

        res.render('pages/product_list', { // Đúng tên file view
            title: pageTitle,
            products,
            categories,
            currentCategorySlug: 'all', // Không có category cụ thể khi tìm kiếm
            sortBy: '', // Không có sắp xếp cụ thể ban đầu khi tìm kiếm
            searchQuery: searchQuery, // Truyền lại searchQuery để hiển thị trên view nếu cần
            wishlistCount,
            cartCount
        });
    } catch (err) {
        console.error('Lỗi tại searchProductsPage:', err);
        next(err);
    }
};

// Thêm/xóa sản phẩm vào wishlist (AJAX)
exports.toggleWishlist = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để sử dụng chức năng này.' });
    }
    const userId = req.session.user._id;
    let { productName } = req.body;
    if (!productName) return res.status(400).json({ success: false, message: 'Thiếu productName.' });
    try {
        const User = require('../models/UserModel');
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user.' });
        let action;
        if (user.wishlist.includes(productName)) {
            await User.updateOne({ _id: userId }, { $pull: { wishlist: productName } });
            action = 'removed';
        } else {
            await User.updateOne({ _id: userId }, { $addToSet: { wishlist: productName } });
            action = 'added';
        }
        // Lấy lại số lượng wishlist mới sau khi cập nhật
        const updatedUser = await User.findById(userId);
        const wishlistCount = updatedUser.wishlist ? updatedUser.wishlist.length : 0;
        return res.json({ success: true, action, wishlistCount });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};

// Hiển thị sản phẩm theo category id (gộp các type thành 1 sản phẩm theo name)
exports.getCategoryProductsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).render('error', { title: 'Không tìm thấy danh mục', message: 'Danh mục không tồn tại.' });
        }
        // Gộp các type thành 1 sản phẩm theo name
        const groupedProducts = {};
        (category.products || []).forEach(prod => {
            if (!groupedProducts[prod.name]) {
                groupedProducts[prod.name] = {
                    _id: prod._id,
                    name: prod.name,
                    description: prod.description,
                    image: prod.image && prod.image.imageData ? `data:${prod.image.imageType};base64,${prod.image.imageData.toString('base64')}` : '/img/product-placeholder.png',
                    types: [],
                    detail: prod.detail,
                    reviewProducts: [],
                    rating: 0,
                    ratingCount: 0
                };
            }
            groupedProducts[prod.name].types.push({
                type: prod.type,
                detail: prod.detail
            });
            // Nếu có reviewProducts thì gộp vào
            if (Array.isArray(prod.reviewProducts) && prod.reviewProducts.length > 0) {
                groupedProducts[prod.name].reviewProducts = groupedProducts[prod.name].reviewProducts.concat(prod.reviewProducts);
            }
        });
        // Tính lại rating trung bình và số lượng đánh giá cho từng sản phẩm (từ tất cả type)
        Object.values(groupedProducts).forEach(product => {
            let totalStars = 0, totalReviews = 0, avgRating = 0;
            if (Array.isArray(product.reviewProducts) && product.reviewProducts.length > 0) {
                totalReviews = product.reviewProducts.length;
                totalStars = product.reviewProducts.reduce((sum, r) => sum + (r.star || 0), 0);
                avgRating = totalStars / totalReviews;
            }
            let displayRating = Math.floor(avgRating + 0.5 * (avgRating % 1 >= 0.5 ? 1 : 0));
            product.rating = avgRating;
            product.displayRating = displayRating;
            product.ratingCount = totalReviews;
        });
        // Đánh dấu hết hàng nếu tất cả các biến thể đều hết stock
        Object.values(groupedProducts).forEach(product => {
            let allOut = true;
            product.types.forEach(type => {
                if (type.detail.some(d => d.stock > 0)) allOut = false;
            });
            product.isOutOfStock = allOut;
        });
        const categories = await Category.find({});
        let wishlist = [];
        let wishlistCount = 0;
        let cartCount = 0;
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            wishlistCount = user && user.wishlist ? user.wishlist.length : 0;
            cartCount = user && user.carts ? user.carts.reduce((sum, item) => sum + (item.orderNumber || 0), 0) : 0;
            if (user && user.wishlist) wishlist = user.wishlist;
        }
        res.render('pages/product_list', {
            title: category.name,
            products: Object.values(groupedProducts),
            categories,
            currentCategory: category.name,
            wishlist,
            wishlistCount,
            cartCount
        });
    } catch (err) {
        next(err);
    }
};

// API gợi ý sản phẩm cho tìm kiếm nhanh
exports.suggestProducts = async (req, res) => {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q || q.length < 2) return res.json([]);
    const products = await Product.find({
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ]
    }).limit(8);
    const result = products.map(p => ({
        name: p.name,
        image: p.image && p.image.imageData ? `data:${p.image.imageType};base64,${p.image.imageData.toString('base64')}` : '/img/product-placeholder.png'
    }));
    res.json(result);
};