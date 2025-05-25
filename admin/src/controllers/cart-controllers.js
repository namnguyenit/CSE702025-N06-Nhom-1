const UserModels = require("../models/user-models");
const ProductModels = require("../models/product-models");

class CartControllers {
  async getImage(req, res) {
    const product = await ProductModels.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.set("Content-Type", product.image.imageType);
    res.send(product.image.imageData);
  }
  async index(req, res) {
    const products = [];

    const user = await UserModels.findOne({ account: "long" });

    // user.carts.forEach(async (item) => {
    //   const product = await ProductModels.findById(item.productID);
    //   products.push(product);
    // });

    for (const item of user.carts) {
      const product = await ProductModels.findById(item.productID);
      products.push(product);
    }

    res.render("carts/index", { products });
  }
}

module.exports = new CartControllers();
