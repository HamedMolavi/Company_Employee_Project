const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const { tokenChecker, tokenGenerator } = require('../utils/session');



module.exports = function ({ database }) {
    router.get('/', (_req, res) => {
        res.render('login');
    });
    router.get('/dashboard', (_req, res) => {
        res.render('admin');
    });
    router.get('/userInfo', tokenChecker(database), (_req, res) => {
        res.json({success: true, results: res.locals.user});
    });


    router.post('/', (req, res) => {
        let searchQuery = ['SELECT * FROM `admins` where `username`=? and `password` =?',
            [req.body.username, req.body.password]];
        dbQueryPromise(database, searchQuery)
            .then(async result => {
                if (result.success) {
                    token = await tokenGenerator(result.results[0].id);
                    return res.json({ success: true, key: token });
                };
                res.status(401).json({ success: result.success, message: 'Wrong Username or Password.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;
    });
    return router
};


