const token = window.location.pathname.split("/").pop();

document.getElementById("resetBtn").addEventListener("click", async () => {
  const newPassword = document.getElementById("newPassword").value;

  if (!newPassword) {
    alert("Please enter a new password");
    return;
  }

  try {
    const res = await axios.post(`http://localhost:5000/password/updatepassword/${token}`, {
      newPassword,
    });

    alert(res.data.message);
    window.location.href = "login.html";
  } catch (err) {
    console.error("Reset Error:", err);
    alert("Failed to reset password. Try again.");
  }
});
