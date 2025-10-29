// server.js

// 1. Load Dependencies
const express = require('express');
const app = express();
require('dotenv').config(); // For loading environment variables (like API keys/DB credentials)

// Import Routes
const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // Will be added later
// const logRoutes = require('./routes/logRoutes');     // Will be added later


// 2. Define the server port
const PORT = process.env.PORT || 3000;


// 3. Middlewares (to handle incoming data formats)
// Handles JSON data (API calls)
app.use(express.json()); 
// Handles URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));


// 4. API Routes Setup

// User Routes: Registration and Login (from Step 5)
// All routes defined in userRoutes.js will be accessed via /api/users/...
app.use('/api/users', userRoutes); 

// Future Routes (Placeholders)
// app.use('/api/admin', adminRoutes);
// app.use('/api/logs', logRoutes);


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
