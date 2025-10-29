const express = require("express");
const router = express.Router();
const { addLog, getUserLogs, updateLog, deleteLog } = require("../controllers/logController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes
router.post("/", authMiddleware, addLog);
router.get("/", authMiddleware, getUserLogs);
router.put("/:id", authMiddleware, updateLog);
router.delete("/:id", authMiddleware, deleteLog);

module.exports = router;
