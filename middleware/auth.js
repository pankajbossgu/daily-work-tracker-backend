// daily-work-tracker-backend/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// ✅ Verify if user is logged in
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT decode error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}

// ✅ Verify if user is Admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin only' });
  }
}

module.exports = { protect, isAdmin };
