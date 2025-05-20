const dashboardRoutes = require("./dashboard-routes");

function route(app) {
  app.use(dashboardRoutes);
}

module.exports = route;
