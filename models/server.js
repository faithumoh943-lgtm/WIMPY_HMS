const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const BarSale = require("./BarSale");
const Expense = require("./Expense");

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("SERVER STARTED ON 5000");

// 🔒 Safe MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/wimpy_hms")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error:", err));

// ================= BAR SALES =================
app.post("/bar-sale", async (req, res) => {
  try {
    const sale = new BarSale(req.body);
    await sale.save();
    res.json({ message: "Bar sale recorded" });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/bar-sales", async (req, res) => {
  const sales = await BarSale.find().sort({ date: -1 });
  res.json(sales);
});

// ================= EXPENSE =================
app.post("/add-expense", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.json({ message: "Expense saved" });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

// ================= AUTO PROFIT =================
app.get("/profit", async (req, res) => {
  const sales = await BarSale.find();
  const expenses = await Expense.find();

  const totalSales = sales.reduce((a,b)=> a + b.total, 0);
  const totalExpenses = expenses.reduce((a,b)=> a + b.amount, 0);

  res.json({
    totalSales,
    totalExpenses,
    profit: totalSales - totalExpenses
  });
});

// ================= SERVER =================
app.listen(5000, () => console.log("WIMPY HMS SERVER RUNNING"));
