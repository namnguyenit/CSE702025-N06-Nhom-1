const express = require("express");
const route = express.Router();
//-------------------------------------

const DashboardRouter = require("../controllers/dashboard-controllers");

route.get("/", DashboardRouter.index);

//-------------------------------------
module.exports = route;
