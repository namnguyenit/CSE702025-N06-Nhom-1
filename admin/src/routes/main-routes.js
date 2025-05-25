const authenticateRoutes = require("./authenticate-routes");
const userRoutes = require("./user-routes");
const productRoutes = require("./product-routes");
const cartRoutes = require("./cart-routes");

function mainRoutes(app) {
  app.use(authenticateRoutes);
  app.use("/users", userRoutes);
  app.use("/products", productRoutes);
  app.use("/carts", cartRoutes);
}

module.exports = mainRoutes;
