const express = require("express");
const route = express.Router();
//-------------------------------------

const DashboardControllers = require("../controllers/dashboard-controllers");

route.get("/dashboard", DashboardControllers.index);

//-------------------------------------
module.exports = route;
