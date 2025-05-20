const DashboardRouter = require("./DashboardRouter");

function route(app) {
  app.use(DashboardRouter);
}

module.exports = route;
