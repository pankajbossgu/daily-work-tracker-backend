// daily-work-tracker-backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Use only one auth middleware import (your existing file: auth.js)
const { protect, isAdmin } = require('../middleware/auth');

// ✅ Import controller functions
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  approveUser 
} = require('../controllers/userController'); 

// ===================================
// PUBLIC ROUTES
// ===================================
router.post('/register', registerUser);
router.post('/login', loginUser);

// ===================================
// AUTHENTICATED USER ROUTES
// ===================================

// ✅ Get current logged-in user details
router.get('/me', protect, async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;

    const result = await db.query(
      'SELECT user_id, email, role, status, created_at FROM Users WHERE user_id = $1',
      [userId]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

// ===================================
// ADMIN ROUTES
// ===================================

// [NEW ROUTE 1] GET /api/admin/users - Fetch all users
router.get('/admin/users', protect, isAdmin, getAllUsers);

// [NEW ROUTE 2] PUT /api/admin/users/:userId/approve - Approve a specific user
router.put('/admin/users/:userId/approve', protect, isAdmin, approveUser);

module.exports = router;
