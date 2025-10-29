// routes/userRoutes.js (around line 12)

// --- 1. User Registration (The Sign-Up) ---
router.post('/register', async (req, res) => {
    // THIS LOG MUST APPEAR IN THE BACKEND CONSOLE IF THE ROUTE IS REACHED!
    console.log('--- ATTEMPTING USER REGISTRATION ---');

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
        const result = await db.query(
            'INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, $3, $4) RETURNING user_id',
            [email, passwordHash, 'Employee', 'Pending']
        );

        // Successful registration, pending approval
        res.status(201).json({
            message: 'Registration successful. Your account is pending Admin approval to log in.',
            user_id: result.rows[0].user_id
        });

    } catch (error) {
        // CRITICAL: Log the specific PostgreSQL error
        console.error('POSTGRES EXECUTION ERROR IN REGISTRATION:', error.message || error);
        res.status(500).json({ message: 'Registration failed. Server error.' });
    }
});

// ... the rest of the userRoutes.js file remains the same
