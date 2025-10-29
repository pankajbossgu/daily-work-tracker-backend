// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  approveUser,
} = require('../controllers/userController');

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected
router.get('/me', authenticateToken, getUserProfile);

// Admin endpoints (protect + role check)
router.get('/admin/users', authenticateToken, authorizeRoles('Admin'), getAllUsers);
router.put('/admin/users/:userId/approve', authenticateToken, authorizeRoles('Admin'), approveUser);

module.exports = router;
