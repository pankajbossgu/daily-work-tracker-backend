// daily-work-tracker-backend/controllers/userController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ---------------------------------------------
// 🟢 REGISTER USER
// ---------------------------------------------
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const userExists = await db.query("SELECT * FROM Users WHERE email = $1", [email]);
    if (userExists.rows.length > 0)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO Users (email, password_hash) VALUES ($1, $2) RETURNING user_id, email, role, status",
      [email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully. Awaiting admin approval.",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// ---------------------------------------------
// 🟢 LOGIN USER
// ---------------------------------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query("SELECT * FROM Users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    if (user.status !== "Approved")
      return res.status(403).json({ error: "Account not approved by admin yet" });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ---------------------------------------------
// 🟢 ADMIN: GET ALL USERS
// ---------------------------------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.query(
      "SELECT user_id, email, role, status, created_at FROM Users ORDER BY user_id ASC"
    );
    res.json(users.rows);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ---------------------------------------------
// 🟢 ADMIN: APPROVE USER
// ---------------------------------------------
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      "UPDATE Users SET status = 'Approved' WHERE user_id = $1 RETURNING user_id, email, status",
      [userId]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User approved successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ error: "Failed to approve user" });
  }
};
