const authenticateDB = require("../service/authenticate-db-service");

function authenticateMiddleware(req, res, next) {
  let hasAuthenticate = req.cookies.authenticateDB in authenticateDB;
  // Authenticate rồi thì mới được vào
  if (hasAuthenticate) return next();
  // Chưa Authenticate thì chuyển vào login
  res.redirect("/login?err=unauthenticated");
}

module.exports = authenticateMiddleware;
