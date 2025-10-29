// routes/adminRoutes.js

const express = require('express');
const router = express.Router();

// NOTE: checkAuth and checkIfAdmin are middlewares that will be implemented 
// later (they ensure the user is logged in AND has the 'Admin' role).
// For now, they are placeholder comments.
// const { checkAuth, checkIfAdmin } = require('../middleware/auth'); 


// --- 1. Admin Approval (User Management) ---
// This route changes a user's status from 'Pending' to 'Approved'
// Accessible only by an Admin.
router.put('/users/approve/:user_id', /* checkAuth, checkIfAdmin, */ async (req, res) => {
    const { user_id } = req.params;

    try {
        // DB Interaction Placeholder:
        // Update the Users table where user_id matches and set status = 'Approved'
        // await db.query('UPDATE Users SET status = $1 WHERE user_id = $2', ['Approved', user_id]);
        
        res.status(200).json({ 
            message: `User ${user_id} successfully approved for login.` 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during user approval.' });
    }
});


// --- 2. Task Management (CRUD - Create, Read, Update, Delete) ---

// a) GET: Read All Active Tasks (Used by both Admin and Employee App)
router.get('/tasks', async (req, res) => {
    try {
        // DB Interaction Placeholder:
        // Select all tasks from the Tasks table
        // const tasks = await db.query('SELECT task_id, task_name, is_active FROM Tasks ORDER BY task_name');
        
        // Placeholder data to show structure
        const placeholderTasks = [
            { task_id: 1, task_name: 'RTO OPEN', is_active: true },
            { task_id: 2, task_name: 'Packing of D-Fame', is_active: true },
            { task_id: 3, task_name: 'Cleaning', is_active: true },
            { task_id: 4, task_name: 'Old Task (Hidden)', is_active: false },
        ];
        
        res.status(200).json(placeholderTasks);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving tasks.' });
    }
});


// b) POST: Add New Task
// Accessible only by an Admin.
router.post('/tasks/add', /* checkAuth, checkIfAdmin, */ async (req, res) => {
    const { task_name } = req.body;
    // const admin_id = req.user.user_id; // Will come from the token after login

    try {
        // DB Interaction Placeholder:
        // Insert new task into the Tasks table. Default is_active=TRUE.
        // await db.query(
        //     'INSERT INTO Tasks (task_name, is_active, created_by_user_id) VALUES ($1, $2, $3)', 
        //     [task_name, true, admin_id] 
        // );

        res.status(201).json({ 
            message: `Task '${task_name}' added successfully.` 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding task.' });
    }
});


// c) PUT: Remove/Deactivate Task (Soft Delete)
// Fulfills the requirement to "Remove Task" without deleting the historical data.
// Accessible only by an Admin.
router.put('/tasks/remove/:task_id', /* checkAuth, checkIfAdmin, */ async (req, res) => {
    const { task_id } = req.params;

    try {
        // DB Interaction Placeholder:
        // Update the Tasks table where task_id matches and set is_active = FALSE
        // await db.query('UPDATE Tasks SET is_active = $1 WHERE task_id = $2', [false, task_id]);
        
        res.status(200).json({ 
            message: `Task ${task_id} successfully marked as inactive (removed from app).` 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deactivating task.' });
    }
});


module.exports = router;
