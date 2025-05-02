const express = require('express');
const path = require('path');
const app = express();
const mainRouter = require('./src/Back_End/Routes/main');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'src/Front_End/Views'));
app.use(express.json());

app.use(express.static(path.join(__dirname,'src','Front_End')));
// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Có lỗi xảy ra!', error: err.message });
});

app.use('/', mainRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server dang chay tai http://localhost:${PORT}`);
});
