const express = require("express");
const route = express.Router();
//-------------------------------------

const DashboardControllers = require("../controllers/dashboard-controllers");

route.get("/", DashboardControllers.index);

//-------------------------------------
module.exports = route;
