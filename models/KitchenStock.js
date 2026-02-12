const mongoose = require("mongoose");

const KitchenStockSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  minStock: {
    type: Number,
    default: 5   // 🔴 minimum alert level
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("KitchenStock", KitchenStockSchema);
