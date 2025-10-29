// db.js

const { Pool } = require('pg');

// Create a new Pool instance using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432, // Default PostgreSQL port
});

// Test connection and log success
pool.connect()
    .then(client => {
        console.log('Successfully connected to the PostgreSQL database!');
        client.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err.stack);
    });

module.exports = pool;
