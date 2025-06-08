const express = require("express");
const route = express.Router();
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const authorizationMiddleware = require("../middleware/authorization-middleware");
const ProductControllers = require("../controllers/product-controllers");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

//-------------------------------------

route.use(authenticateMiddleware);
route.use(authorizationMiddleware);

route.use(upload.single("image"));

route.get("/", ProductControllers.index);
route.get("/image/:id", ProductControllers.getImage);
route.get("/create", ProductControllers.create);
route.post("/store", ProductControllers.store);
route.get("/show/:id", ProductControllers.show);
route.get("/destroy/:id", ProductControllers.destroy);
route.get("/edit/:id", ProductControllers.edit);
route.post("/update", ProductControllers.update);

//-------------------------------------
module.exports = route;
