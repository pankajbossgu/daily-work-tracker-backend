const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// ---------------------- ADMIN ROUTES ----------------------

// ✅ Get all users (for Admin dashboard)
router.get('/users', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT user_id, email, role, status, created_at
       FROM Users
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ Example of another admin route (keep your existing routes below)
router.get('/stats', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         COUNT(*) FILTER (WHERE role = 'Employee') AS total_employees,
         COUNT(*) FILTER (WHERE role = 'Admin') AS total_admins
       FROM Users`
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
