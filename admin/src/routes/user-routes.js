const express = require("express");
const route = express.Router();
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const UserControllers = require("../controllers/user-controllers");
//-------------------------------------

route.get("/", authenticateMiddleware, UserControllers.index);

//-------------------------------------
module.exports = route;
