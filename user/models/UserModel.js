const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true }, // Giá tại thời điểm thêm vào giỏ
    name: { type: String, required: true }, // Tên sản phẩm
    image: {type: String }, // Ảnh sản phẩm
    size: {type: String, required: true},
    group: {type: String, required: true}

}, { _id: false });

const reviewProductSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new Schema({
    username: { type: String, required: [true, 'Vui lòng nhập tên đăng nhập'], unique: true, trim: true, lowercase: true },
    email: { type: String, required: [true, 'Vui lòng nhập email'], unique: true, trim: true, lowercase: true, match: [/.+\@.+\..+/, 'Email không hợp lệ'] },
    password: { type: String, required: [true, 'Vui lòng nhập mật khẩu'], minlength: 6, select: false },
    fullName: { type: String, required: [true, 'Vui lòng nhập họ tên'], trim: true },
    phone: { type: String, trim: true, default: '' },
    address: {
        street: { type: String, trim: true, default: '' },
        city: { type: String, trim: true, default: '' },
        // district: { type: String, trim: true, default: '' },
        // ward: { type: String, trim: true, default: '' },
        // country: { type: String, trim: true, default: 'Vietnam' }
    },
    role: { type: String, enum: ['user', 'admin', 'shipper'], default: 'user' },
    avatar: { type: String, default: '/images/avatar-default.png' }, // Đường dẫn tới ảnh avatar mặc định
    cart: [cartItemSchema],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    reviewProduct: [reviewProductSchema],
    // passwordChangedAt: Date,
    // passwordResetToken: String,
    // passwordResetExpires: Date,
    active: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);