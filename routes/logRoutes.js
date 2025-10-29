// routes/logRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
// 1. Import the middleware
const { authenticateToken } = require('../middleware/auth'); 

// ... other imports

// Apply middleware to all log routes (only logged-in employees can log time)
// Use authenticateToken to protect the POST route
router.post('/log', authenticateToken, async (req, res) => {
    // In this route, you can access the user ID with: req.user.user_id
    // ... Implement logic for logging time (Next Step)
    res.status(200).json({ message: "Time logging placeholder success", user: req.user });
});

// GET /api/log/user/123 - Example protected route to get personal logs
router.get('/user/:userId', authenticateToken, async (req, res) => {
    // Ensure user can only view their OWN logs (important security check)
    if (parseInt(req.params.userId) !== req.user.user_id && req.user.role !== 'Admin') {
        return res.status(403).json({ error: "Access denied. Cannot view other users' logs." });
    }
    // Placeholder success response
    res.status(200).json({ message: "Fetch user logs placeholder success", user: req.user });
});


module.exports = router;
