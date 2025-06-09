const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

// Lấy tất cả đánh giá của mọi type sản phẩm theo _id hoặc name (ưu tiên _id)
exports.getReviews = async (req, res) => {
    try {
        const { productId, productName } = req.params;
        const { type } = req.query; // ?type=...
        let variants = [];
        if (productId) {
            // Tìm theo _id (ưu tiên)
            const prod = await Product.findById(productId).lean();
            if (prod) variants = [prod];
        } else if (productName) {
            // Fallback: tìm theo name (giữ cho cũ)
            variants = await Product.find({ name: productName }).lean();
        }
        let allReviews = [];
        for (const variant of variants) {
            if (Array.isArray(variant.reviewProducts)) {
                for (const r of variant.reviewProducts) {
                    allReviews.push({
                        ...r,
                        type: variant.type,
                        productType: variant.type,
                        productId: variant._id
                    });
                }
            }
        }
        // Lọc theo type nếu có
        let filtered = allReviews;
        if (type && type !== 'all') {
            filtered = allReviews.filter(r => r.type === type);
        }
        // Lấy userId xuất hiện trong review
        let userIds = filtered.map(r => r.userid).filter(Boolean);
        userIds = [...new Set(userIds.map(id => id.toString()))];
        let userMap = {};
        if (userIds.length) {
            const users = await User.find({ _id: { $in: userIds } }).lean();
            users.forEach(u => { userMap[u._id.toString()] = u.name; });
        }
        // Gắn tên user vào review
        filtered = filtered.map(r => ({
            ...r,
            username: r.userid && userMap[r.userid.toString()] ? userMap[r.userid.toString()] : 'Ẩn danh',
            createdAt: r.commentAt || r.createdAt
        }));
        // Sắp xếp theo thời gian mới nhất
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, reviews: filtered });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Gửi đánh giá mới cho sản phẩm (theo type cụ thể, ưu tiên _id)
exports.addReview = async (req, res) => {
    try {
        if (!req.session.user) return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập.' });
        const { productId, productName } = req.params;
        const { type, star, comment } = req.body;
        if (!type || !star || !comment) return res.json({ success: false, message: 'Thiếu thông tin.' });
        let product = null;
        if (productId) {
            product = await Product.findOne({ _id: productId, type });
        } else if (productName) {
            product = await Product.findOne({ name: productName, type });
        }
        if (!product) return res.json({ success: false, message: 'Không tìm thấy sản phẩm.' });
        // Thêm review
        product.reviewProducts = product.reviewProducts || [];
        product.reviewProducts.push({
            userid: req.session.user._id,
            star: Number(star),
            comment,
            commentAt: new Date()
        });
        await product.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
