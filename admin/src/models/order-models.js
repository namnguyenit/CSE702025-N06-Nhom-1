const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemList = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    name: String,
    price: Schema.Types.Mixed,
    size: String,
    image: {
      imageName: String,
      imageType: String,
      imageData: Buffer,
    },
    group: String,
  },
  { _id: false }
);

const orders = new Schema({
  shippingAddress: {
    fullName: String,
    address: String,
    phone: String,
    email: String,
  },
  paymentMethod: String,
  paymentStatus: String,
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: String,
  items: [itemList],
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orders", orders);
