// daily-work-tracker-backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
// FIX APPLIED: Changed fallback port from 3000 to 3001 to match frontend proxy
const port = process.env.PORT || 3001; 

// Import database connection (to ensure it initializes)
const db = require('./db');

// Import routes
const userRoutes = require('./routes/userRoutes');
// NOTE: We also need to import the logRoutes here for the dashboard to work
const logRoutes = require('./routes/logRoutes'); 

// Middleware
// 1. Enable CORS for frontend communication (http://localhost:3001)
app.use(cors({
    origin: 'http://localhost:3001' 
}));

// 2. Body Parser: Use ONLY express.json() to handle incoming JSON data
app.use(express.json()); 


// Basic route for health check
app.get('/', (req, res) => {
    res.send('Daily Work Tracker Backend API is running.');
});

// Route Handlers
// IMPORTANT: All user routes (register, login) must start with /api/users
app.use('/api/users', userRoutes); 
// Add the log routes here!
app.use('/api/logs', logRoutes); 


// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
