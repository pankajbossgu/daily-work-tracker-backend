// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import the database connection established in db.js
const db = require('../db'); 

// --- 1. User Registration (The Sign-Up) ---
router.post('/register', async (req, res) => {
    // Get email and password from the request body
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // 1. Check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 2. Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Create a new user entry
        // Default role is 'Employee', and is_approved is set to FALSE (pending)
        const result = await db.query(
            // NOTE: Changed 'status' to 'is_approved' here, which is the likely fix
            'INSERT INTO users (email, password_hash, role, is_approved) VALUES ($1, $2, $3, $4) RETURNING user_id',
            [email, passwordHash, 'Employee', false] // Set is_approved to false
        );

        // Successful registration, pending approval
        res.status(201).json({ 
            message: 'Registration successful. Your account is pending Admin approval to log in.',
            user_id: result.rows[0].user_id 
        });

    } catch (error) {
        // Log the specific PostgreSQL error for debugging (CRITICAL STEP)
        console.error('POSTGRES EXECUTION ERROR IN REGISTRATION:', error); 
        res.status(500).json({ message: 'Registration failed. Server error.' });
    }
});


// --- 2. User Login (The Sign-In) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // 1. Fetch user from database
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Failed to login. Check credentials or approval status.' });
        }
        const userData = user.rows[0];

        // 2. Verify password
        const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Failed to login. Check credentials or approval status.' });
        }

        // 3. Check for Admin Approval (YOUR CORE REQUIREMENT)
        if (!userData.is_approved) { // Check if the boolean flag is FALSE
            return res.status(403).json({ 
                message: 'Access denied. Your account is pending Admin approval.' 
            });
        }

        // 4. Generate JWT Token and send response
        const token = jwt.sign(
            { user_id: userData.user_id, role: userData.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            token, 
            role: userData.role, 
            message: 'Login successful.',
            user_id: userData.user_id,
            email: userData.email
        });

    } catch (error) {
        console.error('POSTGRES EXECUTION ERROR IN LOGIN:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});


// Middleware to protect routes and verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // No token provided

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.sendStatus(403); // Invalid token
        }
        req.user = user; // user payload contains user_id and role
        next();
    });
};

module.exports = router;
