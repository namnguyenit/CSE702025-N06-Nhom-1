const express = require("express");
const route = express.Router();
//-------------------------------------

const DashboardRouter = require("../app/controller/DashboardController");

route.get("/", DashboardRouter.index);

//-------------------------------------
module.exports = route;
