// server.js

// 1. Load Dependencies
const express = require('express');
const app = express();
require('dotenv').config(); // For loading environment variables (like API keys/DB credentials)

// Import Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const logRoutes = require('./routes/logRoutes'); // The Employee Daily Log routes


// 2. Define the server port
const PORT = process.env.PORT || 3000;


// 3. Middlewares (to handle incoming data formats)
// Handles JSON data (API calls)
app.use(express.json()); 
// Handles URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));


// 4. API Routes Setup

// User Routes: Registration and Login
// Accessible via /api/users/...
app.use('/api/users', userRoutes); 

// Admin Routes: Task Management and User Approval
// Accessible via /api/admin/...
app.use('/api/admin', adminRoutes); 

// Employee Log Routes: Daily Work Submission 
// Accessible via /api/logs/...
app.use('/api/logs', logRoutes); 


// 5. Basic Test Route
// A simple route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Daily Work Tracker Backend API is Running!');
});


// 6. Start the Server
app.listen(PORT, () => {
  // Console log confirms which port the server is listening on
  console.log(`Server is listening on port ${PORT}`);
});
