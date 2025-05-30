const CategoryControllers = require("../controllers/category-controllers");
const express = require("express");
const route = express.Router();
const authenticateMiddleware = require("../middleware/authenticate-middleware");
const multer = require("multer");
const categoryModels = require("../models/category-models");
const upload = multer({ storage: multer.memoryStorage() });

//-------------------------------

route.use(authenticateMiddleware);

route.use(upload.single("image"));

route.get("/", CategoryControllers.index);
route.get("/image/:id", CategoryControllers.getImage);
route.get("/create", CategoryControllers.create);
route.post("/store", CategoryControllers.store);
route.get("/edit/:id", CategoryControllers.edit);
route.post("/update", CategoryControllers.update);
route.get("/destroy/:id", CategoryControllers.destroy);
route.post("/assign", CategoryControllers.assignHandler);
route.get("/assign", CategoryControllers.assign);

//-------------------------------

module.exports = route;
