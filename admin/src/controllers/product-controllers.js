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
    const products = await ProductModels.aggregate([
      { $unwind: "$detail" }, // Tách từng phần tử trong mảng detail
      {
        $sort: {
          name: 1,
          "detail.price": 1, // Ưu tiên giá thấp nhất
        },
      },
      {
        $group: {
          _id: "$name",
          doc: { $first: "$$ROOT" }, // Lấy sản phẩm đầu tiên theo giá
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" }, // Đưa document về gốc
      },
    ]);

    // res.send(products);
    // const products = await ProductModels.find({});
    res.render("products/index", { products });
  }
  async create(req, res) {
    res.render("products/create");
  }
  async store(req, res) {
    //-----------------------------------------
    const body = req.body;
    const inputName = body.name;
    const inputDescription = body.description;
    const inputType = body.type;
    const inputSize = Array.isArray(body.size)
      ? body.size
      : body.size
      ? [body.size]
      : ["M"];
    const inputPrice = body.price;
    const inputStock = body.stock;
    const file = req.file;
    const inputImage = {
      imageName: file?.originalname,
      imageType: file?.mimetype,
      imageData: file?.buffer,
    };
    //-----------------------------------------
    //Delete old Product
    const exist = await ProductModels.findOneAndDelete({
      name: inputName,
      type: inputType,
    });
    //New a product
    const newProduct = new ProductModels({});
    newProduct.name = inputName;
    newProduct.description = inputDescription;
    newProduct.type = inputType;
    newProduct.image = inputImage;
    for (const item of inputSize) {
      newProduct.detail.push({
        size: item,
        price: inputPrice,
        stock: inputStock,
      });
    }
    await newProduct.save();
    res.redirect("/products");
  }
  async show(req, res) {
    res.send("Chức năng đang phát triển");
  }

  async edit(req, res) {
    const product = await ProductModels.find({ name: req.params.id });
    const popup = req.query;
    // res.send(product);
    res.render("products/edit", { product, popup });
  }
  async update(req, res) {
    //-----------------------------------------
    const body = req.body;
    const redirect = body.redirect;
    const id = body.id;
    const inputName = body.name;
    const inputDescription = body.description;
    const inputType = body.type;
    const inputSize = Array.isArray(body.size)
      ? body.size
      : body.size
      ? [body.size]
      : undefined;
    const inputPrice = body.price;
    const inputStock = body.stock;
    const file = req.file;
    const inputImage = {
      imageName: file?.originalname,
      imageType: file?.mimetype,
      imageData: file?.buffer,
    };
    //-----------------------------------------
    //Missing data then kick
    // for (const key in req.body) {
    //   console.log(key, req.body[key]);
    // }
    if (!(inputName && inputDescription && inputType)) {
      return res.redirect(
        `/products/edit/${encodeURIComponent(
          redirect
        )}?type=error&info=missing-data`
      );
    }
    const product = await ProductModels.findById(id);
    if (!product) {
      return res.redirect("/products");
    }
    //Update new data
    product.name = inputName;
    product.description = inputDescription;
    product.type = inputType;
    //Detail
    if (inputSize && inputPrice && inputStock) {
      //xóa cũ
      product.detail = product.detail.filter(
        (item) => !inputSize.includes(item.size)
      );
      //mới
      for (const item of inputSize) {
        product.detail.push({
          size: item,
          price: inputPrice,
          stock: inputStock,
        });
      }
    }
    //hasImage will save
    if (inputImage.imageData) {
      product.image = inputImage;
    }
    await product.save();
    res.redirect("/products");
  }
  async destroy(req, res) {
    await ProductModels.deleteMany({ name: req.params.id });
    res.redirect("/products");
  }
}

module.exports = new ProductController();
