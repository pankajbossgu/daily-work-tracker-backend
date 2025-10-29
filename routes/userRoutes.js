const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import the database connection established in db.js
const db = require('../db'); 

// --- 1. User Registration (The Sign-Up) ---
router.post('/register', async (req, res) => {
    // This log appears when registration is attempted
    console.log('--- ATTEMPTING USER REGISTRATION ---');

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    // Normalize email to lowercase before storage (Best Practice)
    const normalizedEmail = email.toLowerCase(); 

    try {
        // 1. Check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 2. Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Create a new user entry
        const result = await db.query(
            'INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, $3, $4) RETURNING user_id',
            [normalizedEmail, passwordHash, 'Employee', 'Pending'] 
        );

        res.status(201).json({ 
            message: 'Registration successful. Your account is pending Admin approval to log in.',
            user_id: result.rows[0].user_id 
        });

    } catch (error) {
        console.error('POSTGRES EXECUTION ERROR IN REGISTRATION:', error.message || error); 
        res.status(500).json({ message: 'Registration failed. Server error.' });
    }
});


// --- 2. User Login (The Sign-In) ---
router.post('/login', async (req, res) => {
    // CRITICAL LOG: This must appear if the route is hit!
    console.log('--- ATTEMPTING USER LOGIN ---'); 

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Normalize the incoming email to lowercase for reliable matching against the database
        const normalizedEmail = email.toLowerCase(); 
        
        // 1. Fetch user from database
        const user = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
        if (user.rows.length === 0) {
            // Log that the email wasn't found (but don't expose this in the public message)
            console.log(`Login failed: User not found for email ${normalizedEmail}`);
            return res.status(401).json({ message: 'Failed to login. Check credentials or approval status.' });
        }
        const userData = user.rows[0];

        // --- DEBUGGING LOGS ADDED HERE ---
        console.log(`[DEBUG] Attempting login for: ${normalizedEmail}`);
        console.log(`[DEBUG] User Role: ${userData.role}, Status: ${userData.status}`);
        console.log(`[DEBUG] Raw Password Input: ${password}`); // CAUTION: Only for debug!
        console.log(`[DEBUG] Stored Hash: ${userData.password_hash.substring(0, 20)}...`); 
        // ---------------------------------

        // 2. Verify password
        const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
        
        console.log(`[DEBUG] Password Match Result: ${isPasswordValid}`); // Log the comparison result!

        if (!isPasswordValid) {
            console.log(`Login failed: Invalid password for user ${normalizedEmail}`);
            return res.status(401).json({ message: 'Failed to login. Check credentials or approval status.' });
        }

        // 3. Check for Admin Approval 
        if (userData.status !== 'Approved') { 
            console.log(`Login failed: Account pending approval for user ${normalizedEmail}`);
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
        console.log(`Login successful for user ${normalizedEmail} (${userData.role})`);

        res.status(200).json({ 
            token, 
            role: userData.role, 
            message: 'Login successful.',
            user_id: userData.user_id,
            email: userData.email
        });

    } catch (error) {
        console.error('POSTGRES EXECUTION ERROR IN LOGIN:', error.message || error);
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
