// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // adapt to ./config/db if you moved file

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    const existing = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email, role, status`,
      [name, email, hashed, role || 'Employee', 'Approved'] // change default status as you prefer
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Provide email & password' });

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.status && user.status !== 'Approved' && user.status !== 'Active') {
      return res.status(403).json({ message: 'Account not approved' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Get profile (protected)
exports.getUserProfile = async (req, res) => {
  try {
    const uid = req.user.user_id || req.user.id || req.user.userId;
    const r = await db.query('SELECT user_id, name, email, role, status FROM users WHERE user_id = $1', [uid]);
    if (!r.rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Admin: list users
exports.getAllUsers = async (req, res) => {
  try {
    const r = await db.query('SELECT user_id, name, email, role, status, created_at FROM users ORDER BY user_id DESC');
    res.json(r.rows);
  } catch (err) {
    console.error('GetAllUsers Error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Admin: approve user
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.query('UPDATE users SET status = $1 WHERE user_id = $2', ['Approved', userId]);
    res.json({ message: 'User approved' });
  } catch (err) {
    console.error('Approve Error:', err);
    res.status(500).json({ message: 'Failed to approve user' });
  }
};
