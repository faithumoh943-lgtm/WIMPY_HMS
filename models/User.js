const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String, // manager, accountant, frontdesk, bar, staff
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }
});

module.exports = mongoose.model("User", UserSchema);
