// controllers/logController.js

const db = require("../config/db");

// Add a new work log
exports.addLog = async (req, res) => {
  try {
    const { task, date, hours, status, remarks } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      `INSERT INTO work_logs (user_id, task, date, hours, status, remarks)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, task, date, hours, status, remarks]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding log:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get logs for the logged-in user
exports.getUserLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT * FROM work_logs WHERE user_id = $1 ORDER BY date DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user logs:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all logs (for Admin)
exports.getAllLogs = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT wl.*, u.name AS user_name
       FROM work_logs wl
       JOIN users u ON wl.user_id = u.id
       ORDER BY wl.date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all logs:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a log
exports.updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, hours, status, remarks } = req.body;

    const result = await db.query(
      `UPDATE work_logs
       SET task = $1, hours = $2, status = $3, remarks = $4
       WHERE id = $5
       RETURNING *`,
      [task, hours, status, remarks, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating log:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a log
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM work_logs WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json({ message: "Log deleted successfully" });
  } catch (err) {
    console.error("Error deleting log:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
