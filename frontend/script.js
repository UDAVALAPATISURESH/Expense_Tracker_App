const form = document.getElementById("signupForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.status === 201) {
      message.textContent = "Signup successful!";
      message.style.color = "green";
    } else {
      message.textContent = data.message || "Signup failed";
      message.style.color = "red";
    }
  } catch (error) {
    console.error(error);
    message.textContent = "Something went wrong";
    message.style.color = "red";
  }
});
