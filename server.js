const express = require('express');
const cors = require('cors');
// NOTE: We don't need to explicitly require body-parser anymore, 
// as express.json() handles it, but we can keep the require if needed for other uses.
// For this fix, we are simplifying the middleware. 

require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Import database connection (to ensure it initializes)
const db = require('./db');

// Import routes
const userRoutes = require('./routes/userRoutes');

// Middleware
// 1. Enable CORS for frontend communication (http://localhost:3001)
app.use(cors({
    origin: 'http://localhost:3001' 
}));

// 2. Body Parser FIX: Use ONLY express.json() to handle incoming JSON data
// This avoids the "stream is not readable" error.
app.use(express.json()); 


// Basic route for health check
app.get('/', (req, res) => {
    res.send('Daily Work Tracker Backend API is running.');
});

// Route Handlers
// IMPORTANT: All user routes (register, login) must start with /api/users
app.use('/api/users', userRoutes); 


// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
