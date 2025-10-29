// daily-work-tracker-backend/controllers/logController.js

const db = require('../config/db');

// Create a new work log
const createLog = async (req, res) => {
  try {
    const { user_id, task_title, task_description, task_date } = req.body;

    if (!user_id || !task_title || !task_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await db.query(
      `INSERT INTO work_logs (user_id, task_title, task_description, task_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, task_title, task_description || '', task_date]
    );

    res.status(201).json({ message: 'Log created successfully', log: result.rows[0] });
  } catch (err) {
    console.error('Error creating log:', err);
    res.status(500).json({ error: 'Failed to create log' });
  }
};

// Fetch all logs for a user
const getUserLogs = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await db.query(
      `SELECT * FROM work_logs WHERE user_id = $1 ORDER BY task_date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

module.exports = { createLog, getUserLogs };
