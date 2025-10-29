// daily-work-tracker-backend/routes/userRoutes.js

const express = require('express');
// UPDATE: IMPORT the new controller functions
const { 
    registerUser, 
    loginUser, 
    getAllUsers, // <--- Add this
    approveUser // <--- Add this
} = require('../controllers/userController'); 
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// ✅ Get current logged-in user details
router.get('/me', authenticateToken, async (req, res) => {
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

module.exports = router;

// Assuming you have protect and isAdmin middleware in the correct path
const { protect, isAdmin } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// ===================================
// ADMIN ROUTES
// ===================================

// [NEW ROUTE 1] GET /api/admin/users - Fetch all users (Fixes "Failed to load user data")
router.get('/admin/users', protect, isAdmin, getAllUsers);

// [NEW ROUTE 2] PUT /api/admin/users/:userId/approve - Approve a specific user
router.put('/admin/users/:userId/approve', protect, isAdmin, approveUser);


// ... (Keep other existing routes like router.get('/profile', protect, getProfile);)
// ...

module.exports = router;
