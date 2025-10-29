const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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

// 2. Body Parser to handle JSON data
app.use(bodyParser.json()); 
app.use(express.json()); // Ensures express can read JSON bodies

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
