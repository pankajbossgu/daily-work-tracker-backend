const { Pool } = require('pg');

// Load environment variables from .env file
require('dotenv').config();

// Create a new Pool instance for PostgreSQL connection management
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the database connection once when the server starts
pool.connect()
    .then(() => {
        console.log('Successfully connected to the PostgreSQL database!');
    })
    .catch((err) => {
        console.error('Error connecting to the PostgreSQL database:', err);
    });

// Export the pool instance so it can be used to run queries in other files (like userRoutes.js)
module.exports = pool;
