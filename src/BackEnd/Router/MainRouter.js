const AuthenticateRouter = require("./AuthenticateRouter");
const IndexRouter = require("./IndexRouter");
const Catagori = require("./Catagori");

function router(app) {
  app.use(AuthenticateRouter);
  app.use(IndexRouter);
  app.use(Catagori);
}

module.exports = router;
