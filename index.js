const express = require('express');
const app = express();
const port = 3000;

// Middleware để parse JSON
app.use(express.json());

// Route GET đơn giản
app.get('/', (req, res) => {
  res.send('Xin chào từ Express!');
  res.send("MÔIMOIMOIMÔIMOIMOI");
});

// Route POST demo
app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'Đã nhận được dữ liệu', data });
});

// Start server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
