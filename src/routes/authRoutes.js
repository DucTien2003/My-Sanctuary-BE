const express = require("express");
const router = express.Router();

const {
  handleLogin,
  handleRegister,
  handleResetPassword,
  handleForgotPassword,
  handleResetAccessToken,
} = require("../controllers/authController.js");

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/reset-password", handleResetPassword);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-access-token", handleResetAccessToken);

module.exports = router;
