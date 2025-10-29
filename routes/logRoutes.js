// daily-work-tracker-backend/routes/logRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth'); 

// ... (Keep existing POST /api/logs/log and GET /api/logs/tasks routes) ...

// GET /api/logs - Fetch personal log history
router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    
    console.log(`--- DEBUG: User ${user_id} fetching personal log history.`);

    try {
        // !!! FIX REQUIRED: Change l.hours_logged to the actual column name in your Logs table (e.g., l.time_spent) !!!
        const logs = await db.query(
            `SELECT 
                l.log_id, 
                t.task_name, 
                l.work_date, 
                l.hours_logged,  
                l.description 
            FROM Logs l
            JOIN Tasks t ON l.task_id = t.task_id
            WHERE l.user_id = $1
            ORDER BY l.work_date DESC`,
            [user_id]
        );
        
        console.log(`--- DEBUG: Successfully fetched ${logs.rows.length} log history entries.`);

        res.status(200).json(logs.rows);
    } catch (error) {
        console.error('--- CRITICAL ERROR: Error fetching user logs:', error);
        res.status(500).json({ error: 'Failed to fetch log history. Check your backend logRoutes.js file and the database schema for the column name "hours_logged".' });
    }
});

module.exports = router;
