const mongoose = require("mongoose");

const KitchenSaleSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  price: Number,
  cost: {
    type: Number,
    default: 0
  },
  total: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("KitchenSale", KitchenSaleSchema);
