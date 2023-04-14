module.exports = function (database) {
    database.query(
        'SELECT * FROM `admins`',
        [],
        (err, results, _fields) => {
            if (err)  throw err;

            // admin didn't exist
            if (!results.length) {
                return database.query(
                    'INSERT INTO `admins` (`username`, `password`) VALUES (?, ?)',
                    [process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD],
                    (err2, results2, _fields) => {
                        if (err2) throw err2;
                        return console.log('admin ->>', [`id: ${results2.insertId}`, `username: ${process.env.ADMIN_USERNAME}`, `password: ${process.env.ADMIN_PASSWORD}`],'\n=================\n\n');
                    }
                );
            };
            return console.log('admins ->>', results,'\n=================\n\n');
        }
    );
};