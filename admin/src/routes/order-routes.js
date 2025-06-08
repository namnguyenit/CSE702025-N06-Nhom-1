const express = require("express");
const route = express.Router();
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const authorizationMiddleware = require("../middleware/authorization-middleware");
const OrderControllers = require("../controllers/order-controllers");

//--------------------------------

route.use(authenticateMiddleware);
route.use(authorizationMiddleware);

route.get("/", OrderControllers.index);
route.post("/approved", OrderControllers.approved);

//--------------------------------

module.exports = route;
