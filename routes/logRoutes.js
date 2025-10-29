// daily-work-tracker-backend/routes/logRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createLog, getUserLogs } = require('../controllers/logController');

// ✅ Create a new work log
router.post('/', protect, createLog);

// ✅ Fetch logs for a specific user
router.get('/:userId', protect, getUserLogs);

module.exports = router;
