const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const userId = localStorage.getItem("userId"); // set this after login

// Load existing expenses on page load
window.addEventListener("DOMContentLoaded", fetchExpenses);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  try {
    const res = await fetch("http://localhost:5000/api/add-expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description, category, userId })
    });

    const data = await res.json();
    addExpenseToUI(data.expense);
    form.reset();
  } catch (err) {
    console.error("Error adding expense:", err);
  }
});

async function fetchExpenses() {
  try {
    const res = await fetch(`http://localhost:5000/api/get-expenses/${userId}`);
    const expenses = await res.json();
    expenses.forEach(expense => addExpenseToUI(expense));
  } catch (err) {
    console.error("Error loading expenses:", err);
  }
}

function addExpenseToUI(expense) {
  const li = document.createElement("li");
  li.id = expense.id;
  li.innerHTML = `
    ${expense.amount} - ${expense.category} - ${expense.description}
    <button onclick="deleteExpense(${expense.id})">Delete Expense</button>
  `;
  list.appendChild(li);
}

async function deleteExpense(id) {
  try {
    await fetch(`http://localhost:5000/api/delete-expense/${id}`, { method: "DELETE" });
    document.getElementById(id).remove();
  } catch (err) {
    console.error("Error deleting:", err);
  }
}
