
// server.js

// 1. Load the Express framework
const express = require('express');
const app = express();
require('dotenv').config(); // For loading environment variables (like API keys)

// 2. Define the server port
const PORT = process.env.PORT || 3000;

// 3. Middlewares (to handle incoming data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Basic Test Route
app.get('/', (req, res) => {
  res.send('Daily Work Tracker Backend API is Running!');
});

// 5. Start the Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// We will add database connection and main routes in the next steps!
