const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// ---------------- AUTH ROUTES ----------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// ---------------- USER PROFILE ROUTES ----------------
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

// ---------------- ADMIN ROUTES ----------------
router.get("/", authenticateToken, authorizeRoles("Admin"), getAllUsers);
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), deleteUser);

module.exports = router;
