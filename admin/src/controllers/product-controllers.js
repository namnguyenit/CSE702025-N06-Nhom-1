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
      group: inputGroup,
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
    //New a user
    const newProductModel = new ProductModels({
      name: inputName,
      description: inputDescription,
      group: inputGroup,
      price: inputPrice,
      stock: inputStock,
      image: inputImage,
    });
    await newProductModel.save();
    res.redirect("/products");
  }
  async show(req, res) {
    res.send("Chức năng đang phát triển");
  }
  async destroy(req, res) {
    await ProductModels.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  }
  async edit(req, res) {
    const product = await ProductModels.findById(req.params.id);
    const popup = req.query;
    res.render("products/edit", { product, popup });
  }
  async update(req, res) {
    const id = req.body.id;
    const inputName = req.body.name;
    const inputDescription = req.body.description;
    const inputGroup = req.body.group;
    const inputPrice = req.body.price;
    const inputStock = req.body.stock;
    const inputImage = req.file;
    //Missing data then kick
    // for (const key in req.body) {
    //   console.log(key, req.body[key]);
    // }
    if (
      !(inputName && inputDescription && inputGroup && inputPrice && inputStock)
    ) {
      return res.redirect(`/products/edit/${id}?type=error&info=missing-data`);
    }
    const product = await ProductModels.findById(id);
    if (!product) {
      return res.redirect("/products");
    }
    //Update new data
    product.name = inputName;
    product.description = inputDescription;
    product.group = inputGroup;
    product.price = inputPrice;
    product.stock = inputStock;
    //hasImage will save
    if (inputImage) {
      product.image = {
        imageName: inputImage.originalname,
        imageType: inputImage.mimetype,
        imageData: inputImage.buffer,
      };
    }
    await product.save();
    res.redirect("/products");
  }
}

module.exports = new ProductController();
