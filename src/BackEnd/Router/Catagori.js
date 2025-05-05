const express = require("express");
const route = express.Router();
//-------------------------------------

const CatagoriController = require("../Controller/CatagoriController");

route.get("/catagori", CatagoriController.index);

//-------------------------------------
module.exports = route;
