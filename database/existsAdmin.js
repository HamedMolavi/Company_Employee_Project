const bcrypt = require('bcryptjs');

module.exports = function (database) {
    database.query(
        'SELECT * FROM `admins`',
        [],
        (err, results, _fields) => {
            if (err) throw err;

            // admin didn't exist
            if (!results.length) {
                // Hashing password
                bcrypt.hash(process.env.ADMIN_PASSWORD, 10, function (err, hashedPassword) {
                    if (err) throw err;
                    return database.query(
                        'INSERT INTO `admins` (`username`, `password`) VALUES (?, ?)',
                        [process.env.ADMIN_USERNAME, hashedPassword],
                        (err2, results2, _fields) => {
                            if (err2) throw err2;
                            return console.log('admin ->>', [`id: ${results2.insertId}`, `username: ${process.env.ADMIN_USERNAME}`, `password: ${process.env.ADMIN_PASSWORD}`], '\n=================\n\n');
                        }
                    );
                });
            };
            return console.log('admins ->>', results, '\n=================\n\n');
        }
    );
};