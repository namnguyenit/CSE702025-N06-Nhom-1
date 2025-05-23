require("dotenv").config();
const config = require("./src/config/config");
const express = require("express");
const path = require("path");
const app = express();
const mainRoutes = require("./src/routes/main-routes");
const connectDB = require("./src/config/connect-db");
const cookieParser = require("cookie-parser");

connectDB();

app.use(cookieParser());

//Set view
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./src/public/view"));

//Xử lý định dạng
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Có lỗi xảy ra!", error: err.message });
});

//Cấu hình file tĩnh
app.use(express.static(path.join(__dirname, "./src/public")));

//Vấn đề này lúc lỗi lúc không (^-^)
// app.use("/users", express.static(path.join(__dirname, "./src/public")));
// app.use("/products", express.static(path.join(__dirname, "./src/public")));

mainRoutes(app);

app.listen(config.app.port, () => {
  console.log(`Server running on http://localhost:${config.app.port}`);
});
