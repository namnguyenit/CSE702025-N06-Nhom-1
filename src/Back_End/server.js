const express = require('express');
const path = require('path');
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Front_End","Views"));

app.use(express.json());

app.use(express.static(path.join(__dirname, '../Front_End')));
// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Có lỗi xảy ra!', error: err.message });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server dang chay tai http://localhost:${PORT}`);
});


app.get('/', (req, res) => {
  const user = {
    name: 'Cao Đức Trung',
    email: 'trungcaoduc2005@gmail.com',
    github: 'https://github.com/namnguyenit'
  };

  res.render('welcome', { user }); // Gửi object "user" đến index.ejs
});