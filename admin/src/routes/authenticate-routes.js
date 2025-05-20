const express = require("express");
const route = express.Router();
//-------------------------------------

const AuthenticateControllers = require("../controllers/authenticate-controllers");

route.get("/login", AuthenticateControllers.showLoginForm);
route.post("/login", AuthenticateControllers.handleLogin);

//-------------------------------------
module.exports = route;
