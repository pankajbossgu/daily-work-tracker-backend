// routes/logRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth'); 

// ===================================
// EMPLOYEE DASHBOARD DATA FETCHING
// ===================================

// GET /api/logs/tasks - Fetch all active tasks for the employee dropdown
router.get('/tasks', authenticateToken, async (req, res) => {
    // --- DEBUG LOG 1: Request Received ---
    console.log('--- DEBUG: Received request for active tasks.');
    
    try {
        const tasks = await db.query(
            'SELECT task_id, task_name FROM Tasks WHERE is_active = TRUE ORDER BY task_name'
        );
        
        // --- DEBUG LOG 2: Success ---
        console.log(`--- DEBUG: Successfully fetched ${tasks.rows.length} active tasks.`);
        
        res.status(200).json(tasks.rows);
    } catch (error) {
        // --- DEBUG LOG 3: Database Error ---
        console.error('--- CRITICAL ERROR: Database error fetching active tasks:', error.message || error);
        
        // Provide a generic but descriptive error response
        res.status(500).json({ error: 'Server error while fetching available tasks. Check the database logs.' });
    }
});

// POST /api/logs/log - Submit a new work log
router.post('/log', authenticateToken, async (req, res) => {
    const { task_id, hours_logged, description } = req.body;
    const user_id = req.user.user_id; // Added by authenticateToken middleware
    
    // --- DEBUG LOG: Log Submission Attempt ---
    console.log(`--- DEBUG: User ${user_id} attempting to log ${hours_logged}h for task ${task_id}.`);
    
    try {
        await db.query(
            'INSERT INTO Logs (user_id, task_id, work_date, hours_logged, description) VALUES ($1, $2, NOW(), $3, $4)',
            [user_id, task_id, hours_logged, description]
        );
        
        console.log('--- DEBUG: Log submission successful.');
        res.status(201).json({ message: 'Log submitted successfully' });
    } catch (error) {
        console.error('--- CRITICAL ERROR: Database error on log submission:', error.message || error);
        res.status(500).json({ error: 'Failed to submit log entry. Check the database connection and schema.' });
    }
});

// GET /api/logs - Fetch personal log history
router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    
    // --- DEBUG LOG: History Fetch Attempt ---
    console.log(`--- DEBUG: User ${user_id} fetching personal log history.`);

    try {
        // FIX APPLIED: Corrected the column name from 'l.hours_logged' to match 
        // the intended column name, assuming it's 'hours_logged' in the Logs table.
        // It is also possible the column is named 'time_spent', if so, change it here.
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
        
        // --- DEBUG LOG: Success ---
        console.log(`--- DEBUG: Successfully fetched ${logs.rows.length} log history entries.`);

        res.status(200).json(logs.rows);
    } catch (error) {
        // The error indicates a column name mismatch in the database.
        console.error('--- CRITICAL ERROR: Error fetching user logs:', error);
        res.status(500).json({ error: 'Failed to fetch log history. Check if the Logs table has the column "hours_logged".' });
    }
});

module.exports = router;
