const AuthenticationService = require("../service/authentication-service");
const PopupService = require("../service/popup-service");

async function authenticateMiddleware(req, res, next) {
  //turn on/off
  // return next();
  //-----------
  const hasAuthenticate = await AuthenticationService.hasAuthenticate(req, res);
  // Authenticate rồi thì mới được vào
  if (hasAuthenticate) return next();
  // Chưa Authenticate thì chuyển vào login
  PopupService.message(req, res, "error", "Bạn cần đăng nhập !");
  return res.redirect("/login");
}

module.exports = authenticateMiddleware;
