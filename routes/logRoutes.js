// routes/logRoutes.js
const express = require("express");
const router = express.Router();
const {
  addLog,
  getUserLogs,
  updateLog,
  deleteLog,
} = require("../controllers/logController");
const { protect } = require("../middleware/auth");

// ✅ Logged-in user routes
router.post("/", protect, addLog);
router.get("/", protect, getUserLogs);
router.put("/:id", protect, updateLog);
router.delete("/:id", protect, deleteLog);

module.exports = router;
