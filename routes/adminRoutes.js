// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAllUsers, getAllLogs, updateUserRole } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/auth");

// ✅ Admin-only routes
router.get("/users", protect, authorizeRoles("Admin"), getAllUsers);
router.get("/logs", protect, authorizeRoles("Admin"), getAllLogs);
router.put("/user/role", protect, authorizeRoles("Admin"), updateUserRole);

module.exports = router;
