const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
async function clockIn(staffId){
  await fetch(API + "/clock-in",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      role
    },
    body: JSON.stringify({ staff: staffId })
  });

  alert("Clock-in recorded");
}



