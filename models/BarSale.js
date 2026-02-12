const mongoose = require("mongoose");

const BarStockSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  minStock: {
    type: Number,
    default: 10
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BarStock", BarStockSchema);
