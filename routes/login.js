const express = require('express');
const router = express.Router();
const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);
const bcrypt = require('bcryptjs');


module.exports = function ({ models }) {
    router.get('/', (req, res) => {
        if (!!req.session.user) {
            if (req.params.redirect === 'manual') return res.status(302).json({ url: '/dashboard' });
            return res.redirect('dashboard');
        };
        return res.render('login');
    });

    router.get('/userInfo', (req, res) => {
        if (!req.session.user) {
            if (req.params.redirect === 'manual') return res.status(302).json({ url: '/login' });
            return res.redirect('login');
        };
        let results = req.session.user;
        delete results['id'];
        return res.json(results);
    });


    router.post('/', (req, res) => {
        models.User.find({ username: req.body.username })
            .then(async result => {
                if (!!result) {
                    bcrypt.compare(req.body.password, result.password, function (err, exists) {
                        if (!!err) throw err
                        // wrong password
                        if (!exists) return res.status(401).end();
                        // admin exists
                        if (!!req.body.rememberMe) req.session.cookie.maxAge = 31536000000;
                        req.session.user = result;
                        if (req.params.redirect === 'manual') return res.status(302).json({ url: '/dashboard' });
                        return res.redirect('/dashboard');
                    });
                } else return res.status(401).end();
            })
            .catch(err => {
                errlog(`Reading from database ->\n`);
                console.log(err);
                res.status(500).end();
            });
        ;
    });
    return router
};


