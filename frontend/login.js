const form = document.getElementById("loginForm");
const message = document.getElementById("message");

// ---------- LOGIN HANDLER ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.status === 200) {
      message.textContent = "Login successful!";
      message.style.color = "green";

      // ✅ Save userId and token
      if (data.user && data.user.id) {
        localStorage.setItem("userId", data.user.id);
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect after success
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      message.textContent = data.message || "Login failed";
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Error during login:", error);
    message.textContent = "Something went wrong";
    message.style.color = "red";
  }
});

// ---------- FORGOT PASSWORD HANDLERS ----------

// Show forgot password form
const forgotBtn = document.getElementById("forgotPasswordBtn");
const forgotFormContainer = document.getElementById("forgotPasswordFormContainer");
const forgotForm = document.getElementById("forgotPasswordForm");

forgotBtn.addEventListener("click", () => {
  forgotFormContainer.style.display = "block";
});

// Handle forgot password form submission
forgotForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgotEmail").value;
  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/password/forgotpassword", { email });
    alert(res.data.message || "Reset link sent to your email!");
    forgotFormContainer.style.display = "none";
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
});
