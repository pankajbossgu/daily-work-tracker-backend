// daily-work-tracker-backend/routes/userRoutes.js

const express = require('express');
// UPDATE: IMPORT the new controller functions
const { 
    registerUser, 
    loginUser, 
    getAllUsers, 
    approveUser // <--- Add this
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

// [NEW ROUTE 1] GET /api/admin/users - Fetch all users for management
// Fixes the "Failed to load user data" error.
router.get('/admin/users', protect, isAdmin, getAllUsers);

// [NEW ROUTE 2] PUT /api/admin/users/:userId/approve - Approve a specific user
// This is the endpoint called by the "Approve" button.
router.put('/admin/users/:userId/approve', protect, isAdmin, approveUser);


// ... (Keep other existing routes like router.get('/profile', protect, getProfile);)
// ...

module.exports = router;
