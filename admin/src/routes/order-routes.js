const express = require("express");
const route = express.Router();
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const authorizationMiddleware = require("../middleware/authorization-middleware");
const OrderControllers = require("../controllers/order-controllers");
const multer = require("multer");
const upload = multer();

//--------------------------------

route.use(authenticateMiddleware);
route.use(authorizationMiddleware);

route.use(upload.none());

route.get("/", OrderControllers.index);
route.post("/approved", OrderControllers.approved);
route.post("/detail", OrderControllers.detail);
route.post("/cancelled", OrderControllers.cancelled);

//--------------------------------

module.exports = route;
