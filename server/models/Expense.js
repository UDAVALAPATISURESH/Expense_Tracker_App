const express = require("express");
const {
  addExpense,
  getExpenses,
} = require("../controllers/expenseController");

const router = express.Router();

// Add new expense
router.post("/add-expense", addExpense);

// Get all expenses for user
router.get("/get-expenses/:userId", getExpenses);

module.exports = router;
