// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // must match your file location

const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3005;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('✅ Daily Work Tracker Backend API is running...'));

app.listen(port, async () => {
  try {
    await db.query('SELECT NOW()');
    console.log(`✅ Server is listening on port ${port}`);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
});
