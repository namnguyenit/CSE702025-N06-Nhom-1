const authenticateDBService = require("./authenticate-db-service");
const { v4: uuidv4 } = require("uuid");

class AuthenticateService {
  setSession(req, res) {
    //Xóa phiên cũ để thiết lập phiên mới
    const cookie = req.cookies.authenticateDB;
    delete authenticateDBService[cookie];
    //Thiết lập phiên mới
    console.log("Service running with path:", req.path);
    let id = uuidv4();
    res.cookie("authenticateDB", id, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //24 * 60 * 60 * 1000 Thời hạn: 1 ngày
    });
    authenticateDBService[id] = { account: req.body.account };

    console.log("All Sesion:", authenticateDBService);
  }
  getSession() {
    return authenticateDBService;
  }
  clearSesion(req, res) {
    const cookie = req.cookies.authenticateDB;
    delete authenticateDBService[cookie];
    res.clearCookie("authenticateDB", {
      httpOnly: true,
      sameSite: "strict",
    });
  }
}

module.exports = new AuthenticateService();
