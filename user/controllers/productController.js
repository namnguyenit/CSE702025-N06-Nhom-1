// user/controllers/productController.js
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');

const PRODUCTS_PER_PAGE = 9; // Số sản phẩm mỗi trang

exports.getProductListPage = async (req, res, next) => {
    const page = +req.query.page || 1;
    const categorySlug = req.query.category;
    const searchQuery = req.query.search;
    const sortBy = req.query.sort; // ví dụ: 'price-asc', 'price-desc', 'name-asc', 'date-desc'

    let filter = {};
    let categoryName = "Tất cả sản phẩm";

    try {
        console.log('GET /products', { page, categorySlug, searchQuery, sortBy });
        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug });
            if (category) {
                filter.category = category._id;
                categoryName = category.name;
            } else {
                // Không tìm thấy category, có thể trả về trang 404 hoặc hiển thị tất cả sản phẩm
                req.flash('error_msg', 'Danh mục không tồn tại.');
                // return res.redirect('/products');
            }
        }

        if (searchQuery) {
            filter.$text = { $search: searchQuery }; // Sử dụng text index
        }

        let sortOptions = {};
        if (sortBy) {
            const parts = sortBy.split('-');
            if (parts.length === 2) {
                const field = parts[0]; // 'price', 'name', 'createdAt'
                const order = parts[1] === 'desc' ? -1 : 1;
                if (['price', 'name', 'createdAt'].includes(field)) {
                     sortOptions[field] = order;
                }
            }
        }
        if (Object.keys(sortOptions).length === 0) {
            sortOptions.createdAt = -1; // Mặc định sắp xếp mới nhất
        }


        const totalItems = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate('category')
            .sort(sortOptions)
            .skip((page - 1) * PRODUCTS_PER_PAGE)
            .limit(PRODUCTS_PER_PAGE);

        const categories = await Category.find({});
        console.log('Render product_list:', { totalItems, productsCount: products.length, categoriesCount: categories.length });
        res.render('pages/product_list', {
            title: categoryName,
            products,
            categories,
            currentPage: page,
            hasNextPage: PRODUCTS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / PRODUCTS_PER_PAGE),
            currentCategorySlug: categorySlug, // Để active link category
            searchQuery: searchQuery,
            currentSort: sortBy
        });
    } catch (err) {
        console.error('Lỗi getProductListPage:', err);
        next(err);
    }
};

exports.getProductDetailPage = async (req, res, next) => {
    const productSlug = req.params.slug;
    try {
        console.log('GET /products/:slug', { productSlug });
        const product = await Product.findOne({ slug: productSlug }).populate('category');
        if (!product) {
            // return res.status(404).render('pages/404', { title: 'Sản phẩm không tồn tại' });
            const err = new Error('Sản phẩm không tồn tại');
            err.statusCode = 404;
            throw err;
        }

        // Lấy các sản phẩm cùng idSP (các size khác)
        const productVariants = await Product.find({ idSP: product.idSP, _id: { $ne: product._id } });

        // Lấy các sản phẩm liên quan (cùng category, trừ sản phẩm hiện tại và các variant của nó)
        const relatedProducts = await Product.find({
            category: product.category._id,
            idSP: { $ne: product.idSP }, // Không lấy các variant của sản phẩm hiện tại
             _id: { $ne: product._id } // Không lấy chính sản phẩm hiện tại
        }).limit(4);
        
        const categories = await Category.find({});
        console.log('Render product_detail:', { productName: product.name, variants: productVariants.length, related: relatedProducts.length });
        res.render('pages/product_detail', {
            title: product.name,
            product,
            categories,
            productVariants,
            relatedProducts
        });
    } catch (err) {
        console.error('Lỗi getProductDetailPage:', err);
        next(err);
    }
};