const AdminSessionModels = require("./admin-session-models");
const UserModels = require("../../models/user-models");
const { v4: uuidv4 } = require("uuid");

// Xác thực khi đăng nhập, đăng kí
// Yêu cầu phải có account

class SessionService {
  async setSession(req, res) {
    try {
      const inputAccount = req.body.account;
      const user = await UserModels.findOne({ account: inputAccount });
      const uuidAdminSession = uuidv4();
      //Xóa old-sesion server
      await AdminSessionModels.findOneAndDelete({ account: inputAccount });
      //Lưu session server
      const newAdminSession = new AdminSessionModels({});
      newAdminSession.sessionID = uuidAdminSession;
      newAdminSession.account = user.account;
      newAdminSession.name = user.name;
      newAdminSession.role = user.role;
      await newAdminSession.save();
      //Lưu sesion client
      res.cookie("AdminSession", uuidAdminSession, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, //*1000 -> (s)
      });
      console.log("Service running with path:", req.path);
    } catch (error) {
      console.log("ERR", error);
    }
  }
  async clearSession(req, res) {
    try {
      const cookie = req.cookies?.AdminSession;
      if (!cookie) return;
      await AdminSessionModels.findOneAndDelete({ sessionID: cookie });
      res.clearCookie("AdminSession", {
        httpOnly: true,
        sameSite: "strict",
      });
    } catch (error) {
      console.log("ERR", error);
    }
  }
}

module.exports = new SessionService();
