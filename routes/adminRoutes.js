// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
// 1. Import the middleware
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); 

// Placeholder route for approving users - ONLY ADMINS can do this
// This chain checks token, then checks role
router.put('/approve/:userId', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { userId } = req.params;
    
    // ... Implement Admin approval logic (Next Step)
    res.status(200).json({ 
        message: `Admin approval placeholder for user ${userId} success`, 
        admin: req.user 
    });
});

// ... other admin routes (Placeholder for listing all pending users)
router.get('/pending', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    // Placeholder success response
    res.status(200).json({ message: "Fetch pending users placeholder success" });
});

module.exports = router;
