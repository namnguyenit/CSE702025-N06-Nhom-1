const UserModels = require("../models/user-models");

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
}

module.exports = new UserControllers();
