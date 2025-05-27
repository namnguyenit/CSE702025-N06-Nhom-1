const AuthenticateService = require("../service/session/session-service");
const AuthenticationService = require("../service/authentication-service");

async function authenticateMiddleware(req, res, next) {
  //turn on/off
  // return next();
  //-----------
  const hasAuthenticate = await AuthenticationService.hasAuthenticate(req, res);
  // Authenticate rồi thì mới được vào
  if (hasAuthenticate) return next();
  // Chưa Authenticate thì chuyển vào login
  res.redirect("/login?type=error&info=unauthenticated");
}

module.exports = authenticateMiddleware;
