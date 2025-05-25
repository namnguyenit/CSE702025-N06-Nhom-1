const express = require("express");
const route = express.Router();
const CartControllers = require("../controllers/cart-controllers");
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

//---------------------------

route.use(authenticateMiddleware);
route.use(upload.single("image"));

route.get("/", CartControllers.index);
route.get("/image/:id", CartControllers.getImage);

//---------------------------
module.exports = route;
