const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authenticateUser = require("../middleware/auth");


// POST: Add Expense (with transaction)
router.post("/add-expense", authenticateUser, expenseController.addExpense);

// GET: Get all expenses for the logged-in user
router.get("/get-expenses", authenticateUser, expenseController.getExpenses);

// DELETE: Delete an expense (with transaction)
router.delete("/delete-expense/:id", authenticateUser, expenseController.deleteExpense);

module.exports = router;
