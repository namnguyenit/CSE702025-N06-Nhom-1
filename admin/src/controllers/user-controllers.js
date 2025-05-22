const UserModels = require("../models/user-models");
const users = require("../models/user-models");
const bcrypt = require("bcrypt");

class UserControllers {
  async index(req, res) {
    try {
      let users = await UserModels.find({});
      res.render("users/index", { users });
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in UserControllers.index:", error);
      return res.status(500).json({ error: "Error in UserControllers.index" });
    }
  }
  async create(req, res) {
    const err = req.query.err;
    res.render("users/create", { err });
  }
  async store(req, res) {
    try {
      //Validate dữ liệu
      let { account, password, passwordConfirm } = req.body;
      if (password != passwordConfirm) {
        res.redirect("/users/create?err=not-match");
        return;
      }
      //Lưu tài khoản
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new users({
        account: account,
        password: hashedPassword,
      });
      await newUser.save();
      return res.redirect("/users");
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in UserControllers.store:", error);
      return res.status(500).json({ error: "Error in UserControllers.store:" });
    }
  }
  async show(req, res) {
    try {
      //Tìm theo ID
      const user = await UserModels.findById(req.params.id);
      res.render("users/show", { user });
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in UserControllers.show:", error);
      return res.status(500).json({ error: "Error in UserControllers.show" });
    }
  }
  async destroy(req, res) {
    try {
      //Tìm theo ID và xóa
      const user = await UserModels.findByIdAndDelete(req.params.id);
      if (!user) {
        console.log("User not found");
      }
      res.redirect("/users");
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in UserControllers.destroy:", error);
      return res
        .status(500)
        .json({ error: "Error in UserControllers.destroy" });
    }
  }
}

module.exports = new UserControllers();
