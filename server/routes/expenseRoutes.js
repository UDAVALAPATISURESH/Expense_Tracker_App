const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// POST: Add Expense
router.post("/add-expense", async (req, res) => {
  try {
    const { amount, description, category, userId } = req.body;

    const expense = await Expense.create({
      amount,
      description,
      category,
      userId
    });

    res.status(201).json({ message: "Expense added", expense });
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// GET: Fetch all expenses for a user
router.get("/get-expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await Expense.findAll({ where: { userId } });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// DELETE: Delete an expense
router.delete("/delete-expense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.destroy({ where: { id } });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
