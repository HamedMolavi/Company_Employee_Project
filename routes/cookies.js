const express = require('express');
const router = express.Router();



module.exports = function ({ database }) {
    router.post('/', (req, res) => {
        for (const key in req.body) {
            if (Object.hasOwnProperty.call(req.body, key)) {
                const element = req.body[key];
                res.cookie(key, element);
            };
        };
        res.end()
    });
    router.get('/', (req, res) => {
        if (!!req.query.cookie) {
            if (!!req.cookies[req.query.cookie]) {
                return res.json(req.cookies[req.query.cookie])
            };
            return res.json()
        };
        return res.json(req.cookies)
    });
    return router
};


