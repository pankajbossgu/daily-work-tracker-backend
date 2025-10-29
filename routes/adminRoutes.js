const express = require("express");
const router = express.Router();
const { getAllUsers, getAllLogs, updateUserRole } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Admin-only routes
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/logs", authMiddleware, isAdmin, getAllLogs);
router.put("/user/role", authMiddleware, isAdmin, updateUserRole);

module.exports = router;
