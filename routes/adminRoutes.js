// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { getAllUsers, approveUser } = require('../controllers/userController');

router.get('/users', authenticateToken, authorizeRoles('Admin'), getAllUsers);
router.put('/users/:userId/approve', authenticateToken, authorizeRoles('Admin'), approveUser);

module.exports = router;
