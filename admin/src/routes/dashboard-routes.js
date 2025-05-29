const express = require("express");
const route = express.Router();
const DashboardControllers = require("../controllers/dashboard-controllers");
const authenticateMiddleware = require("../middleware/authenticate-middleware");

//----------------------

route.use(authenticateMiddleware);

route.get("/", DashboardControllers.index);

//----------------------

module.exports = route;
