const express = require('express');
const { 
    getAllUsers, 
    approveUser 
} = require('../controllers/userController'); // Uses existing userController functions
const { protect, isAdmin } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Route to fetch all users (Fixes the "Failed to load user data" error)
router.get('/users', protect, isAdmin, getAllUsers);

// Route to approve a user
router.put('/users/:userId/approve', protect, isAdmin, approveUser);

module.exports = router;
