// routes/logRoutes.js

const express = require("express");
const router = express.Router();

// ✅ Import middleware correctly
const { authenticateToken } = require("../middleware/auth");

// ✅ Import controllers
const {
  addLog,
  getUserLogs,
  getAllLogs,
  updateLog,
  deleteLog,
} = require("../controllers/logController");

// ----------------------------------------
// Employee Routes (Authenticated users)
// ----------------------------------------

// Add a new work log
router.post("/", authenticateToken, addLog);

// Get logged-in user's logs
router.get("/my", authenticateToken, getUserLogs);

// Update a specific log by ID
router.put("/:id", authenticateToken, updateLog);

// Delete a specific log by ID
router.delete("/:id", authenticateToken, deleteLog);

// ----------------------------------------
// Admin Routes (View all logs)
// ----------------------------------------
router.get("/all", authenticateToken, getAllLogs);

module.exports = router;
