const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);



module.exports = function ({ database }) {
    router.get('/', (req, res) => {
        !!req.session.user
            ? res.render(req.session.user.role || 'error')
            : res.redirect('/login');
        return;
    });

    
    return router
};


