const express = require('express');
const router = express.Router();
const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);



module.exports = function ({ models }) {
    router.get('/', (req, res) => {
        !!req.session.user
            ? res.render(req.session.user.role || 'error')
            : res.redirect('/login');
        return;
    });

    
    return router
};


