const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/passwordController");

// Forgot password - send mail
router.post("/forgotpassword", passwordController.forgotPassword);

// Reset password page
router.get("/resetpassword/:id", passwordController.resetPasswordForm);

// Update new password
router.post("/updatepassword/:id", passwordController.updatePassword);

module.exports = router;
