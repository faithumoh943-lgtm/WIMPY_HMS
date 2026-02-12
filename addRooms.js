const mongoose = require("mongoose");
const Room = require("./models/Room");

mongoose.connect("mongodb://127.0.0.1:27017/wimpy_hms");

(async()=>{
 await Room.insertMany([
  {number:"001", type:"Standard", price:50000},
  {number:"002", type:"Standard", price:50000},
  {number:"003", type:"Standard", price:50000},
  {number:"004", type:"Standard", price:50000},
  {number:"005", type:"Standard", price:50000},
  {number:"006", type:"Standard", price:35000},
  {number:"007", type:"Standard", price:50000},
  {number:"101", type:"Apartment", price:80000},
  {number:"102", type:"Apartment", price:80000},
  {number:"103", type:"Standard", price:50000},
  {number:"104", type:"Standard", price:50000},
  {number:"105", type:"Standard", price:50000},
  {number:"201", type:"Apartment", price:80000},
  {number:"202", type:"Apartment", price:80000},
  {number:"203", type:"Standard", price:50000},
  {number:"204", type:"Standard", price:50000},
  {number:"205", type:"Standard", price:50000},
  {number:"301", type:"Penthouse", price:80000},
  {number:"302", type:"Penthouse VIP Suit", price:250000},
  {number:"401", type:"Executive Suit", price:200000}
 ]);
 console.log("Rooms added");
 process.exit();
})();
