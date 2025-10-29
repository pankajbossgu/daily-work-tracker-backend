const express = require('express');
const router = express.Router();

// Import authentication middleware
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Import user controller functions
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');

// =============================
// Public Routes
// =============================

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// =============================
// Protected Routes (Require Token)
// =============================

// Get logged-in user profile
router.get('/profile', authenticateToken, getUserProfile);

// Update logged-in user profile
router.put('/profile', authenticateToken, updateUserProfile);

// =============================
// Admin Routes (Require Admin Role)
// =============================

// Get all users
router.get('/', authenticateToken, authorizeRoles('Admin'), getAllUsers);

// Delete a user (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteUser);

module.exports = router;
