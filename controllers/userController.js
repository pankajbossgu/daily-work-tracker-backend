// daily-work-tracker-backend/controllers/userController.js

// ... (Keep all existing imports and functions: registerUser, loginUser, etc.)
// ...

/**
 * [NEW FUNCTION] Fetches all users (ID, email, role, status) for the Admin Dashboard.
 * Requires Admin privileges.
 */
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, email, role, status FROM users ORDER BY status DESC, user_id'
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No users found.' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching all users for Admin:', error.stack);
        res.status(500).json({ error: 'Internal server error while fetching users.' });
    }
};


/**
 * [NEW FUNCTION] Updates a user's status from 'Pending' to 'Approved'.
 * Requires Admin privileges.
 */
const approveUser = async (req, res) => {
    const { userId } = req.params; 

    try {
        const result = await pool.query(
            // Only update users whose current status is 'Pending'
            'UPDATE users SET status = $1 WHERE user_id = $2 AND status = $3 RETURNING user_id, email, status',
            ['Approved', userId, 'Pending']
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found or status is not Pending.' });
        }

        res.status(200).json({ 
            message: 'User successfully approved.', 
            user: result.rows[0] 
        });

    } catch (error) {
        console.error(`Error approving user ${userId}:`, error.stack);
        res.status(500).json({ error: 'Internal server error during user approval.' });
    }
};

// ... (Keep other existing functions)

module.exports = {
    // ... all other existing exports ...
    getAllUsers, // <--- Add this
    approveUser, // <--- Add this
};
