const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true }
});

module.exports = mongoose.model('Category', categorySchema);