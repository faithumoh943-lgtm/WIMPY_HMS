const mongoose = require("mongoose");

const DebitSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  reason: String,
  amount: Number,
  month: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Debit", DebitSchema);
