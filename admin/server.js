const express = require("express");
const path = require("path");
const app = express();
const mainRoutes = require("./src/routes/main-routes");
const connectDB = require("./src/config/database");

connectDB();

const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`Server dang chay tai http://localhost:${PORT}`);
});
