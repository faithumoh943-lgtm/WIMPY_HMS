const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  name: String,
  phone: String,
  room: String,
  checkIn: { type:Date, default:Date.now },
  checkOut: Date,
  amount: Number,
  status: { type:String, default:"CheckedIn" } // CheckedIn | CheckedOut
});

module.exports = mongoose.model("Guest", GuestSchema);
