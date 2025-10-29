const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // PostgreSQL connection pool

// ---------------------------- REGISTER USER ----------------------------
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, $4, 'Active') RETURNING user_id, name, email, role`,
      [name, email, hashedPassword, role || 'User']
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// ---------------------------- LOGIN USER ----------------------------
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Please provide email and password' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
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
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// ---------------------------- GET USER PROFILE ----------------------------
exports.getUserProfile = async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, name, email, role, status FROM users WHERE user_id = $1', [req.user.user_id]);
    const user = result.rows[0];

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// ---------------------------- UPDATE USER STATUS (Admin Only) ----------------------------
exports.updateUserStatus = async (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (!status)
    return res.status(400).json({ message: 'Status is required' });

  try {
    await pool.query('UPDATE users SET status = $1 WHERE user_id = $2', [status, user_id]);
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};
