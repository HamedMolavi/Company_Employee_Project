module.exports = function (database) {
    database.query(
        'SELECT * FROM `admins`',
        [],
        (err, results, _fields) => {
            if (err) {
                throw err
            };
            if (!results.length) {
                return database.query(
                    'INSERT INTO `admins` (`username`, `password`) VALUES (?, ?)',
                    ['admin', 12345678],
                    (err2, results2, _fields) => {
                        if (err2) {
                            throw err2
                        };
                        return console.log('admins ->>', [`id: ${results2.insertId}`, 'username: admin', 'password: 12345678'],'\n=================\n\n');
                    }
                );
            };
            return console.log('admins ->>', results,'\n=================\n\n');
        }
    );
};