const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authGard = require("../middleware/authGard");

router.post("/", authController.auth); 
router.post("/check", authController.checkPhone); 
router.post("/auth-register", authController.authRegister); 
router.post("/login", authController.login); 
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/otp-verify", authController.otpVerify);
router.post("/change-password",authGard.AuthValidator, authController.changePassword);

module.exports = router;