const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
// HARDCODED FIX: Use port 3005 to avoid conflict with React's default 3000
const port = 3005; 

const db = require('./db');

const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes'); 

app.use(cors({
    origin: 'http://localhost:3001' 
}));

app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Daily Work Tracker Backend API is running.');
});

app.use('/api/users', userRoutes); 
app.use('/api/logs', logRoutes); 

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
