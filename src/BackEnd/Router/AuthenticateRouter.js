const express = require("express");
const route = express.Router();
//-------------------------------------

const AuthenticateController = require("../Controller/AuthenticateController");

route.get("/auth", AuthenticateController.index);

//-------------------------------------
module.exports = route;
