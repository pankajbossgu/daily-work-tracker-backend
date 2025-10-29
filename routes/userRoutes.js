// daily-work-tracker-backend/routes/userRoutes.js

const express = require('express');
// IMPORT the new controller functions
const { 
    registerUser, 
    loginUser, 
    getAllUsers, 
    approveUser 
} = require('../controllers/userController'); 

// Assuming you have protect and isAdmin middleware in the correct path
const { protect, isAdmin } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// ===================================
// ADMIN ROUTES
// ===================================

// GET /api/admin/users - Fetch all users for management
router.get('/admin/users', protect, isAdmin, getAllUsers);

// PUT /api/admin/users/:userId/approve - Approve a specific user
// The :userId parameter maps to req.params.userId in the controller
router.put('/admin/users/:userId/approve', protect, isAdmin, approveUser);


// ... (Keep other existing routes like router.get('/profile', protect, getProfile);)
// ...

module.exports = router;
