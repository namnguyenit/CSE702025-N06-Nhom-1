module.exports = {
  // Các biến này vẫn giữ lại để fallback hoặc dùng cho local/test
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 27017,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || "webbtl",
  // database: process.env.DB_NAME || "web",
  // Thêm biến cluster URI để ưu tiên dùng cho cluster
  // clusterUri: process.env.MONGODB_URI || "mongodb://localhost:27017/web"
  clusterUri: process.env.MONGODB_URI || "mongodb://mongo1:27017,mongo2:27017,mongo3:27017/webbtl?replicaSet=rs0"
};
