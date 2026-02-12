const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  number: String,
  type: String,
  price: Number,
  status: { type: String, default: "Available" } // Available | Occupied | Dirty
});

module.exports = mongoose.model("Room", RoomSchema);
