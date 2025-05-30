// user/controllers/productController.js
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');

// Hiển thị trang danh sách sản phẩm (có lọc và sắp xếp)
exports.getProductListPage = async (req, res, next) => {
    try {
        const categoryName = req.query.category;
        const sortBy = req.query.sort;
        let products;
        let currentCategory = null;
        let pageTitle = 'Tất Cả Sản Phẩm';
        let queryConditions = {};
        if (categoryName && categoryName !== 'all') {
            currentCategory = await Category.findOne({ name: categoryName });
            if (currentCategory) {
                queryConditions.category = currentCategory._id;
                pageTitle = currentCategory.name;
            }
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
        products = await Product.find(queryConditions).sort(sortOptions);
        const categories = await Category.find({}).sort({ name: 1 });
        const groupedProducts = {};
        products.forEach(prod => {
            if (!groupedProducts[prod.name]) {
                groupedProducts[prod.name] = {
                    _id: prod._id,
                    name: prod.name,
                    description: prod.description,
                    image: prod.image && prod.image.imageData ? `data:${prod.image.imageType};base64,${prod.image.imageData.toString('base64')}` : '/img/product-placeholder.png',
                    types: [],
                    detail: prod.detail,
                    reviewProducts: prod.reviewProducts
                };
            }
            groupedProducts[prod.name].types.push({
                type: prod.type,
                detail: prod.detail
            });
        });
        res.render('pages/product_list', {
            title: pageTitle,
            products: Object.values(groupedProducts),
            categories,
            currentCategory: categoryName || 'all',
            sortBy: sortBy || ''
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
        const productDetail = {
            _id: variants[0]._id,
            name: productName,
            description: variants[0].description,
            image: variants[0].image && variants[0].image.imageData ? `data:${variants[0].image.imageType};base64,${variants[0].image.imageData.toString('base64')}` : '/img/product-placeholder.png',
            types: variants.map(v => ({
                type: v.type,
                detail: v.detail
            })),
            detail: variants[0].detail,
            reviewProducts: variants[0].reviewProducts
        };
        const categories = await Category.find({});
        res.render('pages/product_detail', {
            title: productName,
            product: productDetail,
            categories
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

        res.render('pages/product_list', { // Đúng tên file view
            title: pageTitle,
            products,
            categories,
            currentCategorySlug: 'all', // Không có category cụ thể khi tìm kiếm
            sortBy: '', // Không có sắp xếp cụ thể ban đầu khi tìm kiếm
            searchQuery: searchQuery // Truyền lại searchQuery để hiển thị trên view nếu cần
        });
    } catch (err) {
        console.error('Lỗi tại searchProductsPage:', err);
        next(err);
    }
};