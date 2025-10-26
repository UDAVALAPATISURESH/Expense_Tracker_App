const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Expense = sequelize.define("Expense", {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

// Relationships
User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

module.exports = Expense;
