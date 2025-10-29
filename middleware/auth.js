// daily-work-tracker-backend/middleware/auth.js

const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Verify token (used for all protected routes)
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
}

// ✅ Alias (same logic) for backward compatibility
const protect = authenticateToken;

// ✅ Role-based authorization
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient privileges" });
    }
    next();
  };
}

module.exports = { authenticateToken, protect, authorizeRoles };
