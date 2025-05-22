const userRoutes = require("./user-routes");
const authenticateRoutes = require("./authenticate-routes");

function mainRoutes(app) {
  app.use("/users", userRoutes);
  app.use(authenticateRoutes);
}

module.exports = mainRoutes;
