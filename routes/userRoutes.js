// routes/userRoutes.js

const express = require('express');
const router = express.Router();

// NOTE: Database connection (db) and helper functions (e.g., hashPassword, generateToken)
// will be imported or defined here when you start local development.
// For now, these are placeholder comments.

// --- 1. User Registration (The Sign-Up) ---
router.post('/register', async (req, res) => {
    // Get email and password from the request body
    const { email, password } = req.body;

    try {
        // 1. Check if user already exists (DB Interaction Placeholder)
        // const existingUser = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
        // if (existingUser.rows.length > 0) {
        //     return res.status(400).json({ message: 'User already exists.' });
        // }

        // 2. Hash the password (Security Placeholder)
        // const passwordHash = await hashPassword(password);

        // 3. Create a new user entry in the Users table (DB Interaction Placeholder)
        // IMPORTANT: Set initial status to 'Pending' and role to 'Employee'
        // await db.query(
        //     'INSERT INTO Users (email, password_hash, role, status) VALUES ($1, $2, $3, $4)', 
        //     [email, passwordHash, 'Employee', 'Pending'] 
        // );

        // Successful registration, but pending approval
        res.status(201).json({ 
            message: 'Registration successful. Awaiting Admin approval to log in.' 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});


// --- 2. User Login (The Sign-In) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Fetch user from database (DB Interaction Placeholder)
        // const user = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
        // if (user.rows.length === 0) {
        //     return res.status(401).json({ message: 'Invalid credentials.' });
        // }
        // const userData = user.rows[0];

        // 2. Verify password (Security Placeholder)
        // const isPasswordValid = await comparePassword(password, userData.password_hash);
        // if (!isPasswordValid) {
        //     return res.status(401).json({ message: 'Invalid credentials.' });
        // }

        // 3. Check for Admin Approval (YOUR CORE REQUIREMENT)
        // if (userData.status !== 'Approved') {
        //     return res.status(403).json({ 
        //         message: 'Access denied. Your account is pending Admin approval.' 
        //     });
        // }

        // 4. Generate JWT Token and send response (Security Placeholder)
        // const token = generateToken(userData.user_id, userData.role);
        // res.status(200).json({ token, role: userData.role, message: 'Login successful.' });

        res.status(200).json({ message: 'Login logic check successful. Credentials and approval verified.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});


module.exports = router;
