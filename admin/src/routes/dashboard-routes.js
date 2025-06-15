const express = require("express");
const route = express.Router();
const DashboardControllers = require("../controllers/dashboard-controllers");
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const authorizationMiddleware = require("../middleware/authorization-middleware");

//----------------------

route.use(authenticateMiddleware);
route.use(authorizationMiddleware);

route.get("/", DashboardControllers.index);
route.get("/price-total", DashboardControllers.priceTotal);
route.get("/total-month", DashboardControllers.totalMonth);

//----------------------

module.exports = route;
