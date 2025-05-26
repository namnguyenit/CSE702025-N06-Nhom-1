const config = require("../config/config");
const UserModels = require("../models/user-models");
const bcrypt = require("bcrypt");

class AdminService {
  async generate() {
    const adminAccount = config.admin.account;
    const adminPassword = config.admin.password;
    const admin = await UserModels.findOne({ account: adminAccount });
    if (admin && admin.role != "Admin") {
      admin.role = "Admin";
      await admin.save();
      return;
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const user = new UserModels({});
    user.account = adminAccount;
    user.password = hashedPassword;
    user.role = "Admin";
    user.name = "Lê Đức Long";
    user.phone = "0368843600";
    user.gmail = "longg56789@gmail.com";
    user.address = "Trên núi";
    await user.save();
  }
}

module.exports = new AdminService();
