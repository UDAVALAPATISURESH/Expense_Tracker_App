// const form = document.getElementById("expenseForm");
// const list = document.getElementById("expenseList");
// const userId = localStorage.getItem("userId"); // must be set after login/signup

// // Load existing expenses
// window.addEventListener("DOMContentLoaded", fetchExpenses);

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const amount = document.getElementById("amount").value;
//   const description = document.getElementById("description").value;
//   const category = document.getElementById("category").value;

//   try {
//     const res = await fetch("http://localhost:5000/api/add-expense", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount, description, category, userId })
//     });

//     const data = await res.json();
//     console.log("Add expense response:", data);

//     addExpenseToUI(data.expense || data); // supports both formats
//     form.reset();
//   } catch (err) {
//     console.error("Error adding expense:", err);
//   }
// });

// async function fetchExpenses() {
//   try {
//     const res = await fetch(`http://localhost:5000/api/get-expenses/${userId}`);
//     const expenses = await res.json();
//     console.log("Fetched expenses:", expenses);

//     if (Array.isArray(expenses)) {
//       expenses.forEach(expense => addExpenseToUI(expense));
//     } else {
//       console.error("Unexpected response format:", expenses);
//     }
//   } catch (err) {
//     console.error("Error loading expenses:", err);
//   }
// }

// function addExpenseToUI(expense) {
//   if (!expense) return; // guard in case of bad data
//   const id = expense.id || expense._id; // support both SQL and MongoDB IDs

//   const li = document.createElement("li");
//   li.id = id;
//   li.innerHTML = `
//     ${expense.amount} - ${expense.category} - ${expense.description}
//     <button onclick="deleteExpense('${id}')">Delete Expense</button>
//   `;
//   list.appendChild(li);
// }

// async function deleteExpense(id) {
//   try {
//     await fetch(`http://localhost:5000/api/delete-expense/${id}`, { method: "DELETE" });
//     document.getElementById(id).remove();
//   } catch (err) {
//     console.error("Error deleting:", err);
//   }


//   async function fetchLeaderboard() {
//   try {
//     const response = await fetch("http://localhost:5000/api/leaderboard");
//     const leaderboard = await response.json();

//     const leaderboardDiv = document.getElementById("leaderboard");
//     leaderboardDiv.innerHTML = "<h3>Leader Board</h3>";

//     leaderboard.forEach(user => {
//       leaderboardDiv.innerHTML += `
//         <p>Name - ${user.User.name} | Total Expense - ${user.totalExpense}</p>
//       `;
//     });
//   } catch (err) {
//     console.error("Error fetching leaderboard:", err);
//   }
// }

// }


const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const userId = localStorage.getItem("userId"); // must be set after login/signup

// Load existing data on page load
window.addEventListener("DOMContentLoaded", () => {
  fetchExpenses();
  fetchLeaderboard();
});

// Add Expense
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
    console.log("Add expense response:", data);

    addExpenseToUI(data.expense || data); // handle SQL or Mongo return format
    form.reset();

    fetchLeaderboard(); // 🔹 update leaderboard
  } catch (err) {
    console.error("Error adding expense:", err);
  }
});

// Fetch all expenses for logged-in user
async function fetchExpenses() {
  try {
    const res = await fetch(`http://localhost:5000/api/get-expenses/${userId}`);
    const expenses = await res.json();
    console.log("Fetched expenses:", expenses);

    list.innerHTML = ""; // clear old list
    if (Array.isArray(expenses)) {
      expenses.forEach(expense => addExpenseToUI(expense));
    } else {
      console.error("Unexpected response format:", expenses);
    }
  } catch (err) {
    console.error("Error loading expenses:", err);
  }
}

// Add expense to UI
function addExpenseToUI(expense) {
  if (!expense) return;
  const id = expense.id || expense._id;

  const li = document.createElement("li");
  li.id = id;
  li.innerHTML = `
    ${expense.amount} - ${expense.category} - ${expense.description}
    <button onclick="deleteExpense('${id}')">Delete</button>
  `;
  list.appendChild(li);
}

// Delete expense
async function deleteExpense(id) {
  try {
    await fetch(`http://localhost:5000/api/delete-expense/${id}`, { method: "DELETE" });
    document.getElementById(id).remove();
    fetchLeaderboard(); // 🔹 update leaderboard
  } catch (err) {
    console.error("Error deleting:", err);
  }
}

// Fetch leaderboard
async function fetchLeaderboard() {
  try {
    const response = await fetch("http://localhost:5000/api/leaderboard");
    const data = await response.json();
    console.log("Leaderboard response:", data);

    const leaderboard = Array.isArray(data) ? data : data.leaderboard || [];

    const leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = "<h3>Leader Board</h3>";

    if (leaderboard.length === 0) {
      leaderboardDiv.innerHTML += "<p>No data yet</p>";
      return;
    }

    leaderboard.forEach(user => {
      leaderboardDiv.innerHTML += `
        <p>Name - ${user.User.name} | Total Expense - ${user.totalExpense}</p>
      `;
    });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
  }
}
