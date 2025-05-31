const UserModels = require("../models/user-models");
const bcrypt = require("bcrypt");
const PopupService = require("../service/popup-service");
const SessionService = require("../service/session/session-service");

class UserControllers {
  async index(req, res) {
    try {
      const users = await UserModels.find({});
      const nameTable = "Users' Table";
      res.render("users/index", { nameTable, users });
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in UserControllers.index:", error);
      return res.status(500).json({ error: "Error in UserControllers.index" });
    }
  }
  async create(req, res) {
    const nameForm = "Create User";
    res.render("users/create", { nameForm });
  }
  async store(req, res) {
    try {
      //--------------------------------------
      const body = req.body;
      const inputAccount = body?.account;
      const inputPassword = body?.password;
      const inputPasswordConfirm = body?.passwordConfirm;
      const inputRole =
        body?.role != "Admin" && body?.role != "User" ? "User" : body.role;
      const inputName = body?.name;
      const inputPhone = body?.phone;
      const inputGmail = body?.gmail;
      const inputAddress = body?.address;
      //--------------------------------------
      //Thiếu dữ liệu
      if (!inputAccount || !inputPassword || !inputPasswordConfirm) {
        PopupService.message(req, res, "error", "Thiếu dữ liệu 😔");
        return res.redirect("/users/create");
      }
      //Tài khoản đã tồn tại
      const user = await UserModels.findOne({ account: inputAccount });
      if (user) {
        PopupService.message(req, res, "error", "Tài khoản đã tồn tại 😔");
        return res.redirect("/users/create");
      }
      //Mật khẩu ko khớp
      if (inputPassword != inputPasswordConfirm) {
        PopupService.message(req, res, "error", "Mật khẩu không khớp 😔");
        return res.redirect("/users/create");
      }
      //Lưu tài khoản
      const newUser = new UserModels({});
      const hashPassword = await bcrypt.hash(inputPassword, 10);
      newUser.account = inputAccount;
      newUser.password = hashPassword;
      newUser.role = inputRole;
      newUser.name = inputName;
      newUser.phone = inputPhone;
      newUser.gmail = inputGmail;
      newUser.address = inputAddress;
      await newUser.save();
      PopupService.message(req, res, "success", "Thêm User thành công");
      return res.redirect("/users/create");
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
      const user = await UserModels.findByIdAndDelete(req.body.id);
      await SessionService.deleteOneSession(user.account);
      res.status(204).end();
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in UserControllers.destroy:", error);
      return res
        .status(500)
        .json({ error: "Error in UserControllers.destroy" });
    }
  }
  async edit(req, res) {
    const user = await UserModels.findById(req.params.id);
    const nameForm = "Edit User";
    res.render("users/edit", { nameForm, user });
  }
  async update(req, res) {
    try {
      const body = req.body;
      const id = body.id;
      const inputAccount = body.account;
      const inputPassword = body?.password;
      const inputPasswordConfirm = body?.passwordConfirm;
      const inputRole =
        body?.role != "Admin" && body?.role != "User" ? "User" : body.role;
      const inputName = body?.name;
      const inputPhone = body?.phone;
      const inputGmail = body?.gmail;
      const inputAddress = body?.address;
      //------------------------------------------------------
      //Thiếu dữ liệu
      if (!inputName || !inputPhone || !inputGmail || !inputAddress) {
        PopupService.message(req, res, "error", "Thiếu dữ liệu 😔");
        return res.redirect(`/users/edit/${id}`);
      }
      //Mật khẩu ko khớp
      if (inputPassword != inputPasswordConfirm) {
        PopupService.message(req, res, "error", "Mật khẩu không khớp 😔");
        return res.redirect(`/users/edit/${id}`);
      }
      //Cập nhật tài khoản
      const user = await UserModels.findById(id);
      //Nếu mật khẩu ko trống
      if (inputPassword && inputPasswordConfirm) {
        const hashPassword = await bcrypt.hash(inputPassword, 10);
        user.password = hashPassword;
      }
      user.role = inputRole;
      user.name = inputName;
      user.phone = inputPhone;
      user.gmail = inputGmail;
      user.address = inputAddress;
      await user.save();
      //role khác Admin thì xóa session hiện tại
      if (inputRole != "Admin") {
        await SessionService.deleteOneSession(inputAccount);
      }
      //
      PopupService.message(req, res, "success", "Sửa User thành công");
      return res.redirect(`/users/edit/${id}`);
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in UserControllers.update:", error);
      return res
        .status(500)
        .json({ error: "Error in UserControllers.update:" });
    }
  }
}

module.exports = new UserControllers();
