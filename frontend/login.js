const form = document.getElementById("loginForm");
const message = document.getElementById("message");

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
      // Login successful
      message.textContent = "Login successful!";
      message.style.color = "green";

      // Optional: store token if backend returns one
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      // Login failed (wrong credentials or other message)
      message.textContent = data.message || "Login failed";
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Error during login:", error);
    message.textContent = "Something went wrong";
    message.style.color = "red";
  }
});
