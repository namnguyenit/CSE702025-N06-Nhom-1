const UserModels = require("../models/user-models");
const ProductModels = require("../models/product-models");
const PopupService = require("../service/popup-service");

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
      { $sort: { createdAt: -1 } },
    ]);

    // res.send(products);
    // const products = await ProductModels.find({});
    const nameTable = "Products' Table";
    res.render("products/index", { nameTable, products });
  }
  async create(req, res) {
    const nameForm = "Create Product";
    res.render("products/create", { nameForm });
  }
  async store(req, res) {
    //-----------------------------------------
    const body = req.body;
    const inputName = body.name;
    const inputDescription = body.description;
    const inputType = body.type;
    const inputPrice = body.price;
    const inputStock = body.stock;
    const file = req.file;
    const inputImage = {
      imageName: file?.originalname,
      imageType: file?.mimetype,
      imageData: file?.buffer,
    };
    //-----------------------------------------

    //Thiếu dữ liệu
    if (!inputName || !inputType) {
      PopupService.message(req, res, "error", "Thiếu dữ liệu");
      return res.redirect("/products/create");
    }
    //exist Product
    const exist = await ProductModels.findOne({
      name: inputName,
      type: inputType,
    });
    if (exist) {
      PopupService.message(
        req,
        res,
        "error",
        `[${inputType}] đã có trong [${inputName}]`
      );
      return res.redirect("/products/create");
    }

    //New a product
    const newProduct = new ProductModels({});
    newProduct.name = inputName;
    newProduct.description = inputDescription;
    newProduct.type = inputType;
    newProduct.image = inputImage;
    for (const item in inputPrice) {
      if (!inputPrice[item]) {
        inputPrice[item] = 0;
      }
      if (!inputStock[item]) {
        inputStock[item] = 0;
      }
      newProduct.detail.push({
        size: item,
        price: inputPrice[item],
        stock: inputStock[item],
      });
    }
    await newProduct.save();
    PopupService.message(req, res, "success", "Thêm Product thành công");
    return res.redirect("/products");
  }
  async show(req, res) {
    res.send("Chức năng đang phát triển");
  }

  async edit(req, res) {
    const product = await ProductModels.find({ name: req.params.id });
    // res.send(product);
    const nameForm = "Edit Product";
    res.render("products/edit", { product, nameForm });
  }
  async update(req, res) {
    //-----------------------------------------
    const body = req.body;
    const redirect = body.redirect;
    const id = body.id;
    const inputName = body.name;
    const inputDescription = body.description;
    const inputType = body.type;
    const inputPrice = body.price;
    const inputStock = body.stock;
    const file = req.file;
    const inputImage = {
      imageName: file?.originalname,
      imageType: file?.mimetype,
      imageData: file?.buffer,
    };

    //-----------------------------------------
    //Thiếu dữ liệu
    if (!(inputName && inputType)) {
      PopupService.message(req, res, "error", "Thiếu dữ liệu 😔");
      return res.redirect(`/products/edit/${encodeURIComponent(redirect)}`);
    }
    const product = await ProductModels.findById(id);
    if (!product) {
      PopupService.message(req, res, "error", "Không tìm thấy sản phẩm 😔");
      return res.redirect(`/products/edit/${encodeURIComponent(redirect)}`);
    }
    //Update new data
    product.name = inputName;
    product.description = inputDescription;
    product.type = inputType;
    //Detail
    product.detail = [];
    for (const item in inputPrice) {
      if (!inputPrice[item]) {
        inputPrice[item] = 0;
      }
      if (!inputStock[item]) {
        inputStock[item] = 0;
      }
      product.detail.push({
        size: item,
        price: inputPrice[item],
        stock: inputStock[item],
      });
    }
    //hasImage will save
    if (inputImage.imageData) {
      product.image = inputImage;
    }
    await product.save();
    PopupService.message(req, res, "success", "Cập nhật thành công");
    return res.redirect(`/products/edit/${encodeURIComponent(inputName)}`);
  }
  async destroy(req, res) {
    await ProductModels.deleteMany({ name: req.params.id });
    PopupService.message(req, res, "success", "Đã xóa sản phẩm ✅");
    res.redirect("/products");
  }
}

module.exports = new ProductController();
