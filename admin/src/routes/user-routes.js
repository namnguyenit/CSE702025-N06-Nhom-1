const express = require("express");
const route = express.Router();
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const UserControllers = require("../controllers/user-controllers");
//-------------------------------------

route.use(authenticateMiddleware);

route.get("/", UserControllers.index);
route.get("/create", UserControllers.create);
route.post("/store", UserControllers.store);
route.get("/show/:id", UserControllers.show);
route.get("/destroy/:id", UserControllers.destroy);

//-------------------------------------
module.exports = route;
