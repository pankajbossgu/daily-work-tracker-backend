// middleware/auth.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify a user's JWT token and attach user data (ID, Role) to the request.
 * Required for all protected routes.
 */
const authenticateToken = (req, res, next) => {
    // 1. Get the token from the request header (Authorization: Bearer <TOKEN>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // 401 Unauthorized - No token provided
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 2. Verify the token using the secret key
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden - Token is invalid or expired
            return res.status(403).json({ error: 'Forbidden. Invalid or expired token.' });
        }
        
        // 3. Attach decoded user payload (user_id, role) to the request object
        req.user = user; 
        next(); // Proceed to the protected route handler
    });
};

/**
 * Middleware to restrict access based on user role.
 * Example: authorizeRoles('Admin')
 */
const authorizeRoles = (requiredRole) => {
    return (req, res, next) => {
        // Check if the user's role matches the required role
        if (req.user.role !== requiredRole) {
            // 403 Forbidden
            return res.status(403).json({ error: `Access denied. Requires role: ${requiredRole}.` });
        }
        next(); // User role is authorized
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};
