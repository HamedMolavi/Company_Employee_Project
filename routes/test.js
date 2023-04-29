const express = require('express');
const router = express.Router();
const User = require('../database/models/user')

module.exports = function ({models}) {
    router.get('/', (req, res) => {
        models.User.find({}).exec((val) =>{
            console.log(val);
        })
        res.send('ok')
    })
}