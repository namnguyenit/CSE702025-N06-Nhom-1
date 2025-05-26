const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSession = new Schema({
  sessionID: String,
  account: String,
  name: String,
  role: String,
  createAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60, //(s)
  },
});

module.exports = mongoose.model("adminSession", adminSession);
