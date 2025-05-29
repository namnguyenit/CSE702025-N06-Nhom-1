const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    group: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{
        imageName: { type: String },
        imageType: { type: String },
        imageData: { type: Buffer }
    }],
    size: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    slug: { type: String, unique: true, lowercase: true, required: true } // Slug cho từng product variant
    // ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    // ratingsQuantity: { type: Number, default: 0 }
}, { timestamps: true });

// Middleware để tự động tạo slug từ name và size nếu chưa có
productSchema.pre('save', function(next) {
    if (this.isModified('name') || this.isModified('size') && !this.slug) {
        this.slug = (this.name + '-' + this.size).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

productSchema.index({ name: 'text', description: 'text' }); // For text search

module.exports = mongoose.model('Product', productSchema);