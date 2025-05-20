const users = require("../models/users");

class DashboardControllers {
  async index(req, res) {
    // res.render("Dashboard/index");
    await users
      .find({})
      .then((users) => {
        res.render("dashboard/index", { users });
      })
      .catch((err) => {
        // Nếu có lỗi, xử lý lỗi và trả về một trạng thái lỗi hoặc thông báo
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
}

module.exports = new DashboardControllers();
