const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth'); 

// ===================================
// EMPLOYEE DASHBOARD DATA FETCHING
// ===================================

// GET /api/logs/tasks - Fetch all active tasks for the employee dropdown
// This endpoint is crucial for populating the task selection in the dashboard.
router.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const tasks = await db.query(
            'SELECT task_id, task_name FROM Tasks WHERE is_active = TRUE ORDER BY task_name'
        );
        res.status(200).json(tasks.rows);
    } catch (error) {
        console.error('Error fetching active tasks for employee dashboard:', error);
        res.status(500).json({ error: 'Server error while fetching available tasks.' });
    }
});


// GET /api/logs - Fetch the current user's daily logs
// This is used to display the employee's log history.
router.get('/', authenticateToken, async (req, res) => {
    // The user_id is guaranteed to be available from the JWT payload via the authenticateToken middleware
    const user_id = req.user.user_id; 

    try {
        const logs = await db.query(
            // Join the DailyLog table with the Tasks table to get the human-readable task_name
            `SELECT 
                l.log_id, 
                l.work_date, 
                l.hours_logged, 
                l.description, 
                t.task_name
            FROM DailyLog l
            JOIN Tasks t ON l.task_id = t.task_id
            WHERE l.user_id = $1
            ORDER BY l.work_date DESC, l.log_id DESC`,
            [user_id]
        );
        res.status(200).json(logs.rows);
    } catch (error) {
        console.error('Error fetching user logs:', error);
        res.status(500).json({ error: 'Server error while fetching your daily logs.' });
    }
});


// ===================================
// TIME LOGGING AND UTILITY ROUTES
// ===================================

// POST /api/logs/log - Route for submitting a new time log (Implementation pending)
router.post('/log', authenticateToken, async (req, res) => {
    // This route will be implemented in a later step
    res.status(200).json({ message: "Time logging endpoint ready (implementation pending).", user: req.user });
});

module.exports = router;
