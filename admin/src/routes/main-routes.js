const dashboardRoutes = require("./dashboard-routes");
const authenticateRoutes = require("./authenticate-routes");

function mainRoutes(app) {
  app.use(dashboardRoutes);
  app.use(authenticateRoutes);
}

module.exports = mainRoutes;
