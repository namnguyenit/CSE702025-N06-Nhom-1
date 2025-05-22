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

//Cấu hình file tĩnh
app.use(express.static(path.join(__dirname, "./src/public")));

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Có lỗi xảy ra!", error: err.message });
});

mainRoutes(app);

const { v4: uuidv4 } = require("uuid");

// Ghi cookie
app.get("/set-cookie", (req, res) => {
  const id = uuidv4();
  res.cookie("sessionID", id, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, //24 * 60 * 60 * 1000 Thời hạn: 1 ngày
  });
  res.send("Cookie đã được tạo!");
});

// Đọc cookie
app.get("/get-cookie", (req, res) => {
  const user = req.cookies.user;
  res.send("Cookie nhận được: " + user);
});

app.listen(config.app.port, () => {
  console.log(`Server running on http://localhost:${config.app.port}`);
});
