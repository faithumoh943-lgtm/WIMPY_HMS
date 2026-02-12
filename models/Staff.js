const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  name: String,
  role: String,
  dailyRate: Number,   // 👈 important
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Staff", StaffSchema);
