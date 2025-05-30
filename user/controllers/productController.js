// user/controllers/productController.js
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');

const PRODUCTS_PER_PAGE = 9; // Số sản phẩm mỗi trang

exports.getProductListPage = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const searchQuery = req.query.search || '';
        const currentSort = req.query.sort || '';
        const currentCategory = req.query.category || '';
        const filter = {};
        if (searchQuery) {
            filter.name = { $regex: searchQuery, $options: 'i' };
        }
        // Lọc theo category (giả sử có trường category hoặc tag trong sản phẩm)
        if (currentCategory && currentCategory !== 'all') {
            if (currentCategory === 'new') filter.isNew = true;
            if (currentCategory === 'featured') filter.isFeatured = true;
            if (currentCategory === 'offer') filter.isOffer = true;
        }
        // Lấy tất cả sản phẩm, gom nhóm theo name
        const allProducts = await Product.find(filter);
        // Gom nhóm các sản phẩm theo name
        const groupedProducts = {};
        allProducts.forEach(prod => {
            if (!groupedProducts[prod.name]) {
                groupedProducts[prod.name] = {
                    name: prod.name,
                    description: prod.description,
                    image: prod.image,
                    types: []
                };
            }
            groupedProducts[prod.name].types.push({
                type: prod.type,
                detail: prod.detail
            });
        });
        // Chuyển thành mảng
        const productCards = Object.values(groupedProducts);
        // Phân trang
        const totalProducts = productCards.length;
        const lastPage = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
        const hasPreviousPage = page > 1;
        const hasNextPage = page < lastPage;
        const previousPage = page - 1;
        const nextPage = page + 1;
        const paginatedProducts = productCards.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);
        res.render('pages/product_list', {
            title: 'Tất cả sản phẩm',
            products: paginatedProducts,
            lastPage,
            currentPage: page,
            hasPreviousPage,
            hasNextPage,
            previousPage,
            nextPage,
            searchQuery,
            currentSort,
            currentCategory
        });
    } catch (err) {
        console.error('Lỗi getProductListPage:', err);
        next(err);
    }
};

exports.getProductDetailPage = async (req, res, next) => {
    const productName = req.params.slug;
    try {
        // Lấy tất cả các biến thể (type) của sản phẩm theo name
        const variants = await Product.find({ name: productName });
        if (!variants || variants.length === 0) {
            const err = new Error('Sản phẩm không tồn tại');
            err.statusCode = 404;
            throw err;
        }
        // Gom lại các type và detail
        const productDetail = {
            name: productName,
            description: variants[0].description,
            image: variants[0].image,
            types: variants.map(v => ({
                type: v.type,
                detail: v.detail
            }))
        };
        res.render('pages/product_detail', {
            title: productName,
            product: productDetail
        });
    } catch (err) {
        console.error('Lỗi getProductDetailPage:', err);
        next(err);
    }
};