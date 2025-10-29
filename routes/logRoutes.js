// routes/logRoutes.js

const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const {
  addLog,
  getUserLogs,
  getAllLogs,
  updateLog,
  deleteLog,
} = require("../controllers/logController");

// 🟢 Add new log (for any logged-in user)
router.post("/", authenticateToken, addLog);

// 🟢 Get logs of the logged-in user
router.get("/my-logs", authenticateToken, getUserLogs);

// 🟣 Get all logs (Admin only)
router.get("/", authenticateToken, authorizeRoles("Admin"), getAllLogs);

// 🟠 Update a log (logged-in user)
router.put("/:id", authenticateToken, updateLog);

// 🔴 Delete a log (logged-in user)
router.delete("/:id", authenticateToken, deleteLog);

module.exports = router;
