const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming this is your database connection
const { authenticateToken } = require('../middleware/auth'); 

// --- 1. POST /api/logs/log - Submit a new work log ---
router.post('/log', authenticateToken, async (req, res) => {
    // CRITICAL CHANGE: Expecting 'durationminutes' from the frontend (in minutes)
    const { task_id, durationminutes, description } = req.body; 
    const user_id = req.user.user_id; 
    const work_date = new Date(); 

    if (!task_id || !durationminutes || !description) {
        return res.status(400).json({ error: 'Missing required log fields.' });
    }

    // Ensure durationminutes is a valid number
    const duration = parseFloat(durationminutes);
    if (isNaN(duration) || duration <= 0) {
         return res.status(400).json({ error: 'Invalid duration value provided.' });
    }

    try {
        // !!! CRITICAL DB FIX HERE !!!
        // Using the correct column name: durationminutes
        // NOTE: The table name is likely 'DailyLog' but using 'Logs' to match the existing file structure.
        const result = await db.query(
            'INSERT INTO Logs (user_id, task_id, work_date, durationminutes, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, task_id, work_date, duration, description]
        );

        res.status(201).json({ 
            message: 'Log successfully recorded.', 
            log: result.rows[0] 
        });
    } catch (error) {
        console.error('Error logging work:', error.stack);
        res.status(500).json({ error: 'Failed to record work log in the database.' });
    }
});

// --- 2. GET /api/logs - Fetch personal log history (CRITICAL FIX HERE) ---
router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    
    console.log(`--- DEBUG: User ${user_id} fetching personal log history.`);

    try {
        // !!! CRITICAL DB FIX HERE !!!
        // Using the correct column name: l.durationminutes
        const logs = await db.query(
            `SELECT 
                l.log_id, 
                t.task_name, 
                l.work_date, 
                l.durationminutes, 
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
        res.status(500).json({ error: 'Failed to fetch log history. The database column name is likely incorrect in logRoutes.js.' });
    }
});

// --- 3. GET /api/logs/tasks - Fetch active tasks ---
router.get('/tasks', authenticateToken, async (req, res) => {
    try {
        // Assumes status='Active' for tasks; adjust if your column/value is different
        const tasks = await db.query('SELECT task_id, task_name FROM Tasks WHERE status = $1 ORDER BY task_name', ['Active']);
        
        console.log(`--- DEBUG: Successfully fetched ${tasks.rows.length} active tasks.`);
        res.status(200).json(tasks.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error.stack);
        res.status(500).json({ error: 'Failed to fetch active tasks.' });
    }
});

module.exports = router;
