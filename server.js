require("dotenv").config();
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authorize = require("./middleware/auth");

// ================= MODELS =================
const User = require("./models/User");
const BarSale = require("./models/BarSale");
const Expense = require("./models/Expense");
const Room = require("./models/Room");
const Guest = require("./models/Guest");
const Staff = require("./models/Staff");
const Attendance = require("./models/Attendance");
const Salary = require("./models/Salary");
const Debit = require("./models/debit");
const KitchenSale = require("./models/KitchenSale");
const KitchenStock = require("./models/KitchenStock");

// Optional BarStock
let BarStock;
try {
  BarStock = require("./models/BarStock");
} catch (e) {
  BarStock = null;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("WIMPY HMS SERVER STARTED");

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Mongo Error:", err));

// ================= LOGIN =================
app.post("/login", async (req,res)=>{
  const user = await User.findOne(req.body);
  if(!user) return res.json({ success:false });
  res.json({ success:true, role:user.role });
});

// ================= STAFF =================
app.post("/add-staff", authorize(["manager"]), async(req,res)=>{
  await new Staff(req.body).save();
  res.json({ message:"Staff added" });
});

app.get("/staff", authorize(["manager","accountant"]), async(req,res)=>{
  res.json(await Staff.find());
});

// ================= ATTENDANCE =================
app.post("/clock-in", authorize(["manager"]), async(req,res)=>{
  await new Attendance({ staff:req.body.staff }).save();
  res.json({ message:"Clocked in" });
});

// ================= DEBITS =================
app.post("/add-debit", authorize(["manager","accountant"]), async(req,res)=>{
  await new Debit(req.body).save();
  res.json({ message:"Debit added" });
});

// ================= AUTO PAY SALARY =================
app.post("/auto-pay-salary", authorize(["manager","accountant"]), async(req,res)=>{
  const { staffId, month } = req.body;

  const staff = await Staff.findById(staffId);
  if(!staff) return res.status(404).json({ error:"Staff not found" });

  const daysWorked = await Attendance.countDocuments({ staff: staffId });
  const dailyRate = staff.salary / 30;
  const gross = dailyRate * daysWorked;

  const debits = await Debit.find({ staff:staffId, month });
  const totalDebits = debits.reduce((a,b)=>a+b.amount,0);
  const netPay = gross - totalDebits;

  await new Salary({
    staff: staffId,
    gross,
    deductions: totalDebits,
    amount: netPay,
    month,
    daysWorked
  }).save();

  res.json({ staff: staff.name, gross, totalDebits, netPay });
});

// ================= PAYSLIP PDF =================
app.get("/payslip/:id", authorize(["manager","accountant"]), async (req,res)=>{
  const salary = await Salary.findById(req.params.id).populate("staff");
  if(!salary) return res.status(404).send("Payslip not found");

  const doc = new PDFDocument({ margin:40 });
  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition","inline; filename=payslip.pdf");
  doc.pipe(res);

  doc.fontSize(18).text("WIMPY HOTEL MANAGEMENT SYSTEM",{align:"center"});
  doc.moveDown();
  doc.fontSize(14).text("PAYSLIP",{align:"center"});
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Staff: ${salary.staff.name}`);
  doc.text(`Month: ${salary.month}`);
  doc.text(`Gross: ₦${salary.gross}`);
  doc.text(`Deductions: ₦${salary.deductions}`);
  doc.text(`Net Pay: ₦${salary.amount}`);

  doc.end();
});

// ================= KITCHEN SALES =================
app.post("/kitchen-sale", authorize(["kitchen","manager"]), async (req,res)=>{
  const sale = new KitchenSale({
    item:req.body.item,
    quantity:req.body.quantity,
    price:req.body.price,
    total:req.body.quantity * req.body.price
  });
  await sale.save();

  await KitchenStock.updateOne(
    { item:req.body.item },
    { $inc:{ quantity:-req.body.quantity } }
  );

  res.json({ message:"Kitchen sale recorded" });
});

// ================= DASHBOARD SUMMARY =================
app.get("/dashboard-summary", authorize(["manager","accountant"]), async (req,res)=>{
  const barTotal = (await BarSale.find()).reduce((a,b)=>a+b.total,0);
  const kitchenTotal = (await KitchenSale.find()).reduce((a,b)=>a+b.total,0);
  const hotelTotal = (await Guest.find({ status:"CheckedOut" })).reduce((a,b)=>a+b.amount,0);

  res.json({
    barTotal,
    kitchenTotal,
    hotelTotal,
    totalRevenue: barTotal + kitchenTotal + hotelTotal
  });
});

// ================= LOW STOCK ALERT =================
app.get("/low-stock-alerts", authorize(["manager","accountant"]), async (req,res)=>{
  const kitchen = await KitchenStock.find({
    $expr: { $lte: ["$quantity", "$minStock"] }
  });

  let bar = [];
  if (BarStock) {
    bar = await BarStock.find({
      $expr: { $lte: ["$quantity", "$minStock"] }
    });
  }

  res.json({ kitchen, bar });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("WIMPY HMS RUNNING ON PORT", PORT));
