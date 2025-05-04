const AuthenticateRouter = require("./AuthenticateRouter");

function router(app) {
  app.use(AuthenticateRouter);
}

module.exports = router;
