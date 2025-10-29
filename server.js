// daily-work-tracker-backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3005; 

const db = require('./db');

const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); // <--- 1. NEW IMPORT

app.use(cors({
    origin: 'http://localhost:3001' 
}));

app.use(express.json()); 


app.get('/', (req, res) => {
    res.send('Daily Work Tracker Backend API is running.');
});

// Route for User Authentication (login/register)
app.use('/api/users', userRoutes); 
app.use('/api/logs', logRoutes); 

// NEW: Route for Admin Functions
app.use('/api/admin', adminRoutes); // <--- 2. MOUNTS AT /api/admin

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
