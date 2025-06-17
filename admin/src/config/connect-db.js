const config = require("./config");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Ưu tiên dùng MONGODB_URI nếu có, fallback về config cũ
    const uri = process.env.MONGODB_URI ||
      `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`;
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
