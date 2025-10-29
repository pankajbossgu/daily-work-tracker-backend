// daily-work-tracker-backend/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// ✅ Middleware to authenticate user via JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
