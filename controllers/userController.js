// daily-work-tracker-backend/controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ---------------- REGISTER ----------------
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, $4, 'Active') RETURNING user_id, name, email, role`,
      [name, email, hashedPassword, role || "Employee"]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// ---------------- LOGIN ----------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

// ---------------- PROFILE ----------------
exports.getUserProfile = async (req, res) => {
  try {
    const user = await db.query("SELECT user_id, name, email, role, status FROM users WHERE user_id = $1", [
      req.user.id,
    ]);

    if (user.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(user.rows[0]);
  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ---------------- UPDATE PROFILE ----------------
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updates = [];

    if (name) updates.push(`name = '${name}'`);
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = '${hashedPassword}'`);
    }

    if (updates.length === 0)
      return res.status(400).json({ message: "No data to update" });

    await db.query(`UPDATE users SET ${updates.join(", ")} WHERE user_id = $1`, [req.user.id]);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Profile update failed" });
  }
};
