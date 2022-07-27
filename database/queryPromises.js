function dbQueryPromise(database, searchQuery) {
    return new Promise((resolve, reject) => {
        database.query(
            ...searchQuery,
            function (err, results, _fields) {
                if (!!err) return reject(err);
                if (!!results.length || !!results.affectedRows) return resolve({ success: true, results });
                resolve({ success: false });
            }
        );
    });
};


module.exports = {
    dbQueryPromise,

}