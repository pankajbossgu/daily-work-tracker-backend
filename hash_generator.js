const bcrypt = require('bcrypt');
const newPassword = 'Admin123!'; // The new, temporary password you will use

const saltRounds = 10;

bcrypt.hash(newPassword, saltRounds)
    .then(hash => {
        console.log('--- NEW HASH GENERATED ---');
        console.log('New Password: ' + newPassword);
        console.log('Hash to use in SQL: ' + hash);
        console.log('--------------------------');
    })
    .catch(err => console.error('Error generating hash:', err));
