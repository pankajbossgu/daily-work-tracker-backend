// daily-work-tracker-backend/server.js (or index.js)

const express = require('express');
const userRoutes = require('./routes/userRoutes'); 
// NEW IMPORT
const adminRoutes = require('./routes/adminRoutes'); // <--- IMPORT NEW FILE
// ... other imports ...

const app = express();
// ... middleware ...

// Route for User Authentication (login/register)
app.use('/api/users', userRoutes); 

// NEW: Route for Admin Functions
app.use('/api/admin', adminRoutes); // <--- MOUNTS AT /api/admin/users

// app.use('/api/logs', logRoutes); // Keep log routes mounted here

// ... rest of the file ...
