// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { addLog, getUserLogs, getAllLogs, updateLog, deleteLog } = require('../controllers/logController');

// create log
router.post('/', authenticateToken, addLog);

// get logged-in user's logs
router.get('/my', authenticateToken, getUserLogs);

// admin: get all logs
router.get('/all', authenticateToken, getAllLogs);

// update & delete
router.put('/:id', authenticateToken, updateLog);
router.delete('/:id', authenticateToken, deleteLog);

module.exports = router;
