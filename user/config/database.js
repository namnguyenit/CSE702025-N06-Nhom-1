const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected to User App...');
    } catch (err) {
        console.error('MongoDB connection error (User App):', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;