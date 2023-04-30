const mongoose = require('mongoose');
const existsAdmin = require('./existsAdmin');
const errlog = require('../utils/log').errlog(__filename);

async function makeConnection() {
    try {
        const prefix = !!process.env.DATABASE_USERNAME
            ? `${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@`
            : '';
        const mongoURI = `mongodb://${prefix}${process.env.DATABASE_HOST ?? '127.0.0.1'}:${process.env.DATABASE_PORT ?? 27017}/${process.env.DATABASE_DATABASE ?? 'auth'}`
        await mongoose.connect(mongoURI);
        // Access models and return them all in one object;
        const models = {
            User: require('./models/user'),
            Employee: require('./models/employee'),
            Company: require('./models/company'),
        };
        existsAdmin(models);
        return models;
    } catch (error) {
        errlog('\n\n=================\nDatabase connection failed.\n=================');
        errlog(error);
        process.exit(1);
    };
};

module.exports = makeConnection;