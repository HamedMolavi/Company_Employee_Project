const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const { readTicket, writeTicket } = require('../tools/tickets');



module.exports = function ({ database }) {
    router.get('/', (_req, res) => {
        res.render('login');
    });
    router.get('/dashboard', (req, res) => {
        readTicket(req.query.ticket)
            .then(data => {
                res.render('admin', { id: data.id, username: data.username, password: data.password, day: data.day });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                err.errno === -4058
                    ? res.status(402).json({ success: false, message: 'No user returned from server.' })
                    : res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;
    });
    router.post('/', (req, res) => {
        let searchQuery = ['SELECT * FROM `admins` where `username`=? and `password` =?',
            [req.body.username, req.body.password]];
        dbQueryPromise(database, searchQuery)
            .then(result => {
                if (result.success) {
                    return writeTicket(JSON.stringify(result.results[0]))
                        .then((ticket) => {
                            return res.status(200).json({ success: true, ticket });
                        })
                        .catch((err) => {
                            console.log(`Reading from database (${__filename})\n`, err);
                            res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
                        });
                    ;
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


