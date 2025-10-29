// Assuming this file contains existing functions like registerUser and loginUser,
// and imports the database connection pool (e.g., const pool = require('../db');)

// ... (Keep all existing imports and functions: registerUser, loginUser, etc.)
// ...

// New function to fetch all users (for Admin Dashboard)
const getAllUsers = async (req, res) => {
    try {
        // Query to select essential user data (excluding password hash)
        const result = await pool.query(
            'SELECT user_id, email, role, status FROM users ORDER BY user_id'
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No users found.' });
        }

        // Return the list of users
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching all users for Admin:', error.stack);
        res.status(500).json({ error: 'Internal server error while fetching users.' });
    }
};


// New function to approve a pending user
const approveUser = async (req, res) => {
    const { userId } = req.params; // Get user_id from the URL parameter

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required for approval.' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET status = $1 WHERE user_id = $2 AND status = $3 RETURNING user_id, email, status',
            ['Approved', userId, 'Pending']
        );

        if (result.rowCount === 0) {
            // This happens if the user_id doesn't exist or if they were already Approved/Rejected
            return res.status(404).json({ error: 'User not found or status is not Pending.' });
        }

        // Return the updated user information
        res.status(200).json({ 
            message: 'User successfully approved.', 
            user: result.rows[0] 
        });

    } catch (error) {
        console.error(`Error approving user ${userId}:`, error.stack);
        res.status(500).json({ error: 'Internal server error during user approval.' });
    }
};

// ... (Keep all existing exports)

module.exports = {
    // ... all other existing exports ...
    getAllUsers, // EXPORT the new function
    approveUser, // EXPORT the new function
};
