const express = require("express");
const route = express.Router();
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const DashboardControllers = require("../controllers/dashboard-controllers");
//-------------------------------------

route.get("/dashboard", authenticateMiddleware, DashboardControllers.index);

//-------------------------------------
module.exports = route;
