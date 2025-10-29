// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
// Import the middleware
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); 

// ===================================
// ADMIN TASK MANAGEMENT ROUTES
// ===================================

// POST /api/admin/tasks - Create a new Task (Admin Only)
router.post('/tasks', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { task_name } = req.body;
    const created_by_user_id = req.user.user_id; // Get admin ID from token

    if (!task_name) {
        return res.status(400).json({ error: 'Task name is required.' });
    }

    try {
        const result = await db.query(
            'INSERT INTO Tasks (task_name, created_by_user_id) VALUES ($1, $2) RETURNING task_id, task_name, is_active',
            [task_name, created_by_user_id]
        );
        res.status(201).json({ message: 'Task created successfully.', task: result.rows[0] });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Server error during task creation.' });
    }
});

// PUT /api/admin/tasks/:taskId/status - Activate/Deactivate a Task (Admin Only)
router.put('/tasks/:taskId/status', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { taskId } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
        return res.status(400).json({ error: 'Status (is_active) must be true or false.' });
    }

    try {
        const result = await db.query(
            'UPDATE Tasks SET is_active = $1 WHERE task_id = $2 RETURNING task_id, task_name, is_active',
            [is_active, taskId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.status(200).json({ message: `Task ${is_active ? 'activated' : 'deactivated'} successfully.`, task: result.rows[0] });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Server error during task status update.' });
    }
});

// GET /api/admin/tasks/active - Fetch ALL active tasks (for employee dropdowns)
// NOTE: This route is slightly less restricted (Admin authorized only), but good to keep here for task management overview.
router.get('/tasks/active', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    try {
        const tasks = await db.query('SELECT task_id, task_name FROM Tasks WHERE is_active = TRUE ORDER BY task_name');
        res.status(200).json(tasks.rows);
    } catch (error) {
        console.error('Error fetching active tasks:', error);
        res.status(500).json({ error: 'Server error while fetching tasks.' });
    }
});


// ===================================
// ADMIN USER MANAGEMENT ROUTES
// ===================================

// GET /api/admin/pending - Fetch all users awaiting approval (Admin Only)
router.get('/pending', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    try {
        const users = await db.query('SELECT user_id, email, created_at FROM Users WHERE status = $1 ORDER BY created_at ASC', ['Pending']);
        res.status(200).json(users.rows);
    } catch (error) {
        console.error('Error fetching pending users:', error);
        res.status(500).json({ error: 'Server error while fetching pending users.' });
    }
});

// PUT /api/admin/approve/:userId - Approve a pending user (Admin Only)
router.put('/approve/:userId', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            'UPDATE Users SET status = $1 WHERE user_id = $2 AND status = $3 RETURNING user_id, email, status',
            ['Approved', userId, 'Pending']
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found or already approved.' });
        }

        res.status(200).json({ message: 'User approved successfully.', user: result.rows[0] });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: 'Server error during user approval.' });
    }
});

// GET /api/admin/all-logs - Fetch ALL daily logs from ALL users (Admin Only)
router.get('/all-logs', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    try {
        const logs = await db.query(
            `SELECT 
                l.*, 
                u.email, 
                t.task_name 
            FROM DailyLog l
            JOIN Users u ON l.user_id = u.user_id
            JOIN Tasks t ON l.task_id = t.task_id
            ORDER BY l.work_date DESC, u.email ASC`
        );
        res.status(200).json(logs.rows);
    } catch (error) {
        console.error('Error fetching all logs:', error);
        res.status(500).json({ error: 'Server error while fetching all logs.' });
    }
});


module.exports = router;
