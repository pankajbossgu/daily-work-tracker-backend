// daily-work-tracker-backend/server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ------------------ Database ------------------
const db = require("./config/db"); // ✅ FIXED PATH

// ------------------ App Initialization ------------------
const app = express();
const port = process.env.PORT || 3005;

// ------------------ Middleware ------------------
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Match your frontend React port
    credentials: true,
  })
);

app.use(express.json());

// ------------------ Route Imports ------------------
const userRoutes = require("./routes/userRoutes");
const logRoutes = require("./routes/logRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ------------------ Root Route ------------------
app.get("/", (req, res) => {
  res.send("✅ Daily Work Tracker Backend API is running...");
});

// ------------------ Routes ------------------

// User Authentication & Profile routes (login, register, /me)
app.use("/api/users", userRoutes);

// Work logs (employee task logs)
app.use("/api/logs", logRoutes);

// Admin-only routes (manage users, stats)
app.use("/api/admin", adminRoutes);

// ------------------ Error Handling ------------------
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ------------------ Start Server ------------------
app.listen(port, async () => {
  try {
    await db.query("SELECT NOW()");
    console.log(`✅ Server is listening on port ${port}`);
    console.log("✅ Successfully connected to the PostgreSQL database!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
});
