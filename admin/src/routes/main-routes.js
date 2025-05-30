const authenticateRoutes = require("./authenticate-routes");
const userRoutes = require("./user-routes");
const productRoutes = require("./product-routes");
const dashboardRoutes = require("./dashboard-routes");
const categoryRoutes = require("./category-routes");

function mainRoutes(app) {
  app.use(authenticateRoutes);
  app.use("/users", userRoutes);
  app.use("/products", productRoutes);
  app.use("/dashboard", dashboardRoutes);
  app.use("/categories", categoryRoutes);
}

module.exports = mainRoutes;
