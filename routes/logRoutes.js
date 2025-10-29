// routes/logRoutes.js

const express = require('express');
const router = express.Router();
const moment = require('moment'); // We will use a library called 'moment' for time calculations

// NOTE: checkAuth is a middleware that ensures the user is logged in.
// const { checkAuth } = require('../middleware/auth'); 

// --- Helper Function: Calculate Duration ---
// This function takes start and end times (as strings) and returns the duration in minutes.
function calculateDuration(startTime, endTime) {
    // We assume the date is the same for simplicity in this function
    const start = moment(startTime, 'HH:mm'); // '10:00'
    const end = moment(endTime, 'HH:mm');   // '11:30'

    // Calculate the difference in minutes
    const duration = end.diff(start, 'minutes');

    // Handle cases where end time might be on the next day (e.g., 23:00 to 01:00)
    if (duration < 0) {
        // Add 24 hours (1440 minutes) to account for crossing midnight
        return duration + 1440; 
    }

    return duration;
}


// --- 1. POST: Submit a New Daily Work Log ---
// Accessible by an 'Employee' after logging in.
router.post('/submit', /* checkAuth, */ async (req, res) => {
    // 1. Get data from the App
    const { 
        task_id, 
        start_time, // e.g., "10:00"
        end_time,   // e.g., "11:30"
        is_completed, // The Checkbox (true/false)
        notes 
    } = req.body;
    
    // const user_id = req.user.user_id; // Will come from the login token
    const work_date = moment().format('YYYY-MM-DD'); // Current date for the log

    try {
        // 2. Calculate the required Duration field
        const duration_minutes = calculateDuration(start_time, end_time);

        // 3. Validate duration (optional but good practice)
        if (duration_minutes <= 0) {
            return res.status(400).json({ message: 'End Time must be after Start Time.' });
        }

        // 4. Insert the log into the DailyLog table (DB Interaction Placeholder)
        // await db.query(
        //     'INSERT INTO DailyLog (user_id, task_id, work_date, start_time, end_time, duration_minutes, is_completed, notes, logged_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())', 
        //     [user_id, task_id, work_date, start_time, end_time, duration_minutes, is_completed, notes] 
        // );

        res.status(201).json({ 
            message: `Work log submitted successfully. Duration calculated: ${duration_minutes} minutes.` 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error submitting work log.' });
    }
});


module.exports = router;
