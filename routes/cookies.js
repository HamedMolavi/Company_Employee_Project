const express = require('express');
const router = express.Router();



module.exports = function ({ models }) {
    router.post('/', (req, res) => {
        for (const key in req.body) {
            if (Object.hasOwnProperty.call(req.body, key)) {
                const element = req.body[key];
                res.cookie(key, element, {maxAge: 31536000000});
            };
        };
        res.end()
    });
    // router.get('/', (req, res) => {
    //     console.log(req.cookies);
    //     if (!!req.query.cookie) {
    //         result = !!req.cookies[req.query.cookie] ? req.cookies[req.query.cookie] : null
    //         return res.json(result)
    //     };
    //     return res.json(req.cookies)
    // });
    return router
};


