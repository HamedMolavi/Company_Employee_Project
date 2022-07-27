const mysql = require('mysql2');
const existsAdmin = require('./existsAdmin');

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
        console.log('\n\n=================\nDatabase connection failed.\n=================');
        console.log(error);
        process.exit(1);

    };
};

module.exports = makeConnection;