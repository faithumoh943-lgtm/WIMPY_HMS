const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  gross: Number,
  deductions: Number,
  amount: Number, // NET PAY
  month: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Salary", SalarySchema);

