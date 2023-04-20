const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);
const bcrypt = require('bcryptjs');



module.exports = function ({ database }) {
    router.get('/', (req, res) => {
        if (!!req.session.user) {
            if (req.params.redirect === 'manual') return res.status(302).json({ url: '/dashboard' });
            return res.redirect('dashboard');
        };
        dlog(!!req.session.user)
        return res.render('login');
    });

    router.get('/userInfo', (req, res) => {
        if (!req.session.user) {
            if (req.params.redirect === 'manual') return res.status(302).json({ url: '/login' });
            return res.redirect('login');
        };
        results = req.session.user;
        delete results['id'];
        return res.json(results);
    });


    router.post('/', (req, res) => {
        let searchQuery = ['SELECT * FROM `admins` where `username`=?',
            [req.body.username]];
        dbQueryPromise(database, searchQuery)
            .then(async result => {
                if (result.success) {
                    bcrypt.compare(req.body.password, result.results[0].password, function (err, exists) {
                        if (!!err) throw err
                        // wrong password
                        if (!exists) return res.status(401).end();
                        // admin exists
                        if (!!req.body.rememberMe) req.session.cookie.maxAge = 31536000000;
                        req.session.user = result.results[0];
                        if (req.params.redirect === 'manual') return res.status(302).json({ url: '/dashboard' });
                        return res.redirect('/dashboard');
                    });
                } else return res.status(401).end();
            })
            .catch(err => {
                errlog(`Reading from database ->\n`, err);
                res.status(500).end();
            });
        ;
    });
    return router
};


