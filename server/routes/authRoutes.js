const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get User Profile
router.get("/profile/:id", getProfile);

// Update User Profile
router.put("/profile/:id", updateProfile);

module.exports = router;