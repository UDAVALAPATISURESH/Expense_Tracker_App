const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category, userId } = req.body;

    if (!amount || !description || !category || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
      userId,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const expenses = await Expense.findAll({ where: { userId } });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
