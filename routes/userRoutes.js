// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/userController");

// ✅ Use correct middleware file (auth.js)
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// ----------------------------------------
// Public Routes (No Auth Required)
// ----------------------------------------

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// ----------------------------------------
// Protected Routes (Auth Required)
// ----------------------------------------

// Get logged-in user's profile
router.get("/me", authenticateToken, getUserProfile);

// Update logged-in user's profile
router.put("/me", authenticateToken, updateUserProfile);

// ----------------------------------------
// Admin Routes (Only accessible to Admin users)
// ----------------------------------------

router.get(
  "/admin/all",
  authenticateToken,
  authorizeRoles("Admin"),
  getAllUsers
);

module.exports = router;
