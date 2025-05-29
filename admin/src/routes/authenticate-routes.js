const express = require("express");
const route = express.Router();
const AuthenticateControllers = require("../controllers/authenticate-controllers");

//-------------------------------------

route.get("/", AuthenticateControllers.showLoginForm);
route.get("/login", AuthenticateControllers.showLoginForm);
route.post("/login", AuthenticateControllers.handleLogin);
route.get("/logout", AuthenticateControllers.handleLogout);

//-------------------------------------
module.exports = route;
