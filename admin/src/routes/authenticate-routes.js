const express = require("express");
const route = express.Router();
//-------------------------------------

const AuthenticateControllers = require("../controllers/authenticate-controllers");

route.get("/login", AuthenticateControllers.showLoginForm);

//-------------------------------------
module.exports = route;
