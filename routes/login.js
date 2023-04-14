const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const { tokenChecker, tokenGenerator } = require('../utils/session');
const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);



module.exports = function ({ database }) {
    router.get('/', (_req, res) => {
        return res.render('login');
    });
    router.get('/dashboard', (_req, res) => {
        return res.render('admin');
    });
    router.get('/userInfo', (req, res) => {
        results = req.session.user;
        delete results['id'];
        return res.json({success: true, results});
    });


    router.post('/', (req, res) => {
        let searchQuery = ['SELECT * FROM `admins` where `username`=? and `password` =?',
            [req.body.username, req.body.password]];
        dbQueryPromise(database, searchQuery)
            .then(async result => {
                if (result.success) {
                    req.session.user = result.results[0]
                    return res.redirect('/dashboard')
                };
                res.status(401).json({ success: false, message: 'Wrong Username or Password.' });
            })
            .catch(err => {
                errlog(`Reading from database ->\n`, err);
                res.status(500).json({ success: false, message: 'Something went wrong.' });
            });
        ;
    });
    return router
};


