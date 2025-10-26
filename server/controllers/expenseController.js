const Expense = require("../models/Expense");
const User = require("../models/User");
const { sequelize } = require("../models"); // Sequelize instance

// 🧾 Add Expense (with transaction)
exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction
  try {
    const { amount, description, category } = req.body;
    const userId = req.user?.id; // Authenticated user ID

    if (!amount || !description || !category) {
      await t.rollback();
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ Create expense
    const expense = await Expense.create(
      { amount, description, category, userId },
      { transaction: t }
    );

    // 2️⃣ Update total expense in User table
    const user = await User.findByPk(userId, { transaction: t });
    user.totalExpense += parseFloat(amount);
    await user.save({ transaction: t });

    // ✅ Commit
    await t.commit();

    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    await t.rollback();
    console.error("Transaction Failed:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// 📋 Get All Expenses (no transaction)
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id; // From token (authenticated user)
    const expenses = await Expense.findAll({ where: { userId } });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🗑️ Delete Expense (with transaction)
exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;
    const userId = req.user.id;

    // 1️⃣ Find the expense
    const expense = await Expense.findOne({
      where: { id: expenseId, userId },
      transaction: t,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    // 2️⃣ Subtract from user's totalExpense
    const user = await User.findByPk(userId, { transaction: t });
    user.totalExpense -= parseFloat(expense.amount);
    await user.save({ transaction: t });

    // 3️⃣ Delete the expense
    await expense.destroy({ transaction: t });

    // ✅ Commit
    await t.commit();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Failed to delete expense", error: error.message });
  }
};
