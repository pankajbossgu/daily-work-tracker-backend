// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController"); // ✅ make sure this file exists

// Example admin routes (you can customize)
router.get("/all-users", adminController.getAllUsers);
router.get("/all-logs", adminController.getAllLogs);
router.post("/update-user-role", adminController.updateUserRole);

module.exports = router;
