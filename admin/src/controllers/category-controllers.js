const CategoryModels = require("../models/category-models");
const PopupService = require("../service/popup-service");
const ProductModels = require("../models/product-models");
const mongoose = require("mongoose");

class CategoryControllers {
  async getImage(req, res) {
    const category = await CategoryModels.findById(req.params.id);
    if (!category) return res.status(404).send("Product not found");
    res.set("Content-Type", category.image.imageType);
    res.send(category.image.imageData);
  }
  async index(req, res) {
    const nameTable = "Categories Table";
    const categories = await CategoryModels.find({});
    return res.render("categories/index", { nameTable, categories });
  }
  async create(req, res) {
    const nameForm = "Create category";
    return res.render("categories/create", { nameForm });
  }
  async store(req, res) {
    const body = req.body;
    const inputName = body.name;
    const file = req.file;
    const inputImage = {
      imageName: file?.originalname,
      imageType: file?.mimetype,
      imageData: file?.buffer,
    };
    //--------------------------------
    if (!inputName || !file) {
      PopupService.message(req, res, "error", "Thiếu dữ liệu 😔");
      return res.redirect("/categories/create");
    }
    //Lưu data
    const newCategory = new CategoryModels({});
    newCategory.name = inputName;
    newCategory.image = inputImage;
    await newCategory.save();
    PopupService.message(req, res, "success", "Thêm thành công");
    return res.redirect("/categories/create");
  }
  async edit(req, res) {
    const id = req.params.id;
    const category = await CategoryModels.findById(id);
    const nameForm = "Edit Category";
    return res.render("categories/edit", { nameForm, category });
  }
  async update(req, res) {
    const body = req.body;
    const inputName = body.name;
    const id = body.id;
    const file = req.file;
    const inputImage = {
      imageName: file?.originalname,
      imageType: file?.mimetype,
      imageData: file?.buffer,
    };
    //--------------------------------
    if (!inputName) {
      PopupService.message(req, res, "error", "Thiếu dữ liệu 😔");
      return res.redirect("/categories/create");
    }
    //Lưu data
    const category = await CategoryModels.findById(id);
    category.name = inputName;
    //hasImage
    if (req.file) {
      category.image = inputImage;
    }
    await category.save();
    PopupService.message(req, res, "success", "Lưu thành công");
    return res.redirect("/categories/create");
  }
  async destroy(req, res) {
    const id = req.params.id;
    const category = await CategoryModels.findByIdAndDelete(id);
    PopupService.message(req, res, "success", "Xóa thành công");
    return res.redirect("/categories");
  }
  async assign(req, res) {
    const products = await ProductModels.find({});
    const categories = await CategoryModels.find({});
    const nameTable = "Assign products to categories";
    res.render("categories/assign", { nameTable, products, categories });
  }
  async assignHandler(req, res) {
    const body = req.body;
    const categoryID = body.categoryID;
    const productID = body.productID;
    const category = await CategoryModels.findById(categoryID);
    if (!category) {
      return res.redirect("/categories/assign");
    }
    if (!category.products.includes(productID)) {
      category.products.push(productID);
      await category.save();
    }
    PopupService.message(req, res, "success", "Success");
    return res.redirect("/categories/assign");
  }
  async show(req, res) {
    const categoryID = req.params.id;
    const categories = await CategoryModels.findById(categoryID);
    const products = await ProductModels.find({
      _id: { $in: categories.products },
    });
    const nameTable = "Category detail";
    return res.render("categories/show", { nameTable, categoryID, products });
  }
  async unassign(req, res) {
    const body = req.body;
    const categoryID = body.categoryID;
    const productID = body.productID;
    //Gỡ
    const category = await CategoryModels.findById(categoryID);
    const index = category.products.indexOf(productID);
    if (index !== -1) {
      category.products.splice(index, 1); // xóa 1 phần tử tại vị trí index
    }
    await category.save();
    PopupService.message(req, res, "success", "Gỡ sản phẩm thành công");
    return res.redirect(`/categories/show/${categoryID}`);
  }
}

module.exports = new CategoryControllers();
