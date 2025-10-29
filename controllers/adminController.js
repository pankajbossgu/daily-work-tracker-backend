// controllers/adminController.js
const db = require("../config/db");

// ✅ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email, role FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all logs (example)
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
    console.error("Error fetching logs:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Update user role (example)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const result = await db.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING *",
      [role, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user role:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
