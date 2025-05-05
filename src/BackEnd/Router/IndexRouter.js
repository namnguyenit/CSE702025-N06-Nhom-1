const express = require("express");
const route = express.Router();
//-------------------------------------

const IndexController = require("../Controller/IndexController");

route.get("/", IndexController.index);
route.get("/index", IndexController.index);

//-------------------------------------
module.exports = route;
