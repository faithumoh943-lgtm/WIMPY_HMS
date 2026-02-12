const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/wimpy_hms")
.then(async()=>{
 await User.create({username:"manager", password:"1234", role:"manager"});
 console.log("Manager Created Successfully");
 process.exit();
});
