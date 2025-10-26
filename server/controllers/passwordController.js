const User = require("../models/User");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");


// POST: Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token and expiry
    const resetToken = uuidv4();
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Configure mail transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourappemail@gmail.com", // replace
        pass: "your-app-password", // replace with Gmail app password
      },
    });

    const resetLink = `http://localhost:5000/password/resetpassword/${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: "yourappemail@gmail.com",
      to: email,
      subject: "Password Reset Link",
      html: `<p>Click here to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// GET: Reset password form
exports.resetPasswordForm = async (req, res) => {
  try {
    const { id: token } = req.params;
    const user = await User.findOne({ where: { resetToken: token } });

    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).send("Invalid or expired token");
    }

    // Redirect to frontend reset page
    res.redirect(`http://127.0.0.1:5500/frontend/reset.html?token=${token}`);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST: Update password
exports.updatePassword = async (req, res) => {
  try {
    const { id: token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({ where: { resetToken: token } });

    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
