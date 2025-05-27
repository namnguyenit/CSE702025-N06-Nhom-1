module.exports = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 27017,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || "web",
};
