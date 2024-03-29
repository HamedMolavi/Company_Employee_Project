const mysql = require('mysql2');
const existsAdmin = require('./existsAdmin');
const errlog = require('../utils/log').errlog(__filename);

async function makeConnection() {
    try {
        const database = mysql.createConnection({
            host: process.env.DATABASE_HOST || 'localhost',
            user: process.env.DATABASE_USER || 'root',
            database: process.env.DATABASE_DATABASE || 'company_employee',
            password: process.env.DATABASE_PASSWORD
        });
        existsAdmin(database);
        return database;
    } catch (error) {
        errlog('\n\n=================\nDatabase connection failed.\n=================');
        errlog(error);
        process.exit(1);
    };
};

module.exports = makeConnection;