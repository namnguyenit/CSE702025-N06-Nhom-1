const AuthenticationService = require("../service/authentication-service");
const PopupService = require("../service/popup-service");

async function authenticateMiddleware(req, res, next) {
  //turn on/off
  // return next();
  //-----------
  const isAdmin = await AuthenticationService.isAdmin(req, res);
  // isAdmin thì mới được vào
  if (isAdmin) return next();
  // Chưa isAdmin thì chuyển vào login
  PopupService.message(req, res, "error", "Bạn không có quyền quản trị !");
  return res.redirect("/login");
}

module.exports = authenticateMiddleware;
