const UserModels = require("../models/user-models");
const ProductModels = require("../models/product-models");
const AuthenticateService = require("../service/authenticate-service");

class ProductController {
  async getImage(req, res) {
    const product = await ProductModels.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.set("Content-Type", product.image.imageType);
    res.send(product.image.imageData);
  }
  async index(req, res) {
    const products = await ProductModels.find({});
    res.render("products/index", { products });
  }
  async create(req, res) {
    res.render("products/create");
  }
  async store(req, res) {
    let {
      name: inputName,
      description: inputDescription,
      price: inputPrice,
      stock: inputStock,
    } = req.body;
    let inputImage = null;
    if (req.file) {
      inputImage = {
        imageName: req.file.originalname,
        imageType: req.file.mimetype,
        imageData: req.file.buffer,
      };
    }
    //Xác định user theo account
    let account = AuthenticateService?.getUser(req, res)?.account;
    if (!account) {
      account = null;
    }
    //New a user
    const newProductModel = new ProductModels({
      userID: account,
      name: inputName,
      description: inputDescription,
      price: inputPrice,
      stock: inputStock,
      image: inputImage,
    });
    await newProductModel.save();
    res.redirect("/products");
  }
  async show(req, res) {
    res.render("products/show");
  }
  async destroy(req, res) {}
  async edit(req, res) {
    res.render("products/edit");
  }
  async update(req, res) {}
}

module.exports = new ProductController();
