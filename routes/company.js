const express = require('express');
const router = express.Router();
const { validator } = require('../validation/index');
const { creatCompanySchema, editCompanySchema, deleteCompanySchema } = require('../validation/company');
const errlog = require('../utils/log').errlog(__filename);

module.exports = function ({ models }) {

    //-------------
    // Creat Company
    //-------------
    router.post('/', validator(creatCompanySchema, models), (req, res) => { //
        let now = new Date();
        models.Company.create({
            companyname: req.body.companyname,
            registeredNumber: req.body.registeredNumber,
            tel: req.body.tel,
            city: req.body.city ?? null,
            province: req.body.province ?? null,
            avatar: req.body.avatar ?? '/Images/icons/companies/logo.png',
        })
            .then(result => result ? res.status(200).json(result) : res.status(404).end())
            .catch(err => {
                errlog(`Creating company failed ->\n`);
                console.log(err);
                err.code === 11000
                    ? res.status(406).end()
                    : res.status(500).end();
            });
    });


    //-------------
    // Edit Company
    //-------------
    router.post('/edit', validator(editCompanySchema, models), (req, res) => { //
        let updateQuery = {
            companyname: req.body.companyname,
            tel: req.body.tel,
            city: req.body.city,
            province: req.body.province,
            avatar: req.body.avatar,
        };
        if (!!req.body.registeredNumber) updateQuery.registeredNumber = req.body.registeredNumber;
        models.Company.findByIdAndUpdate(req.body.id, updateQuery)
            .then(result => result ? res.status(200).json(result) : res.status(404).end())
            .catch(err => {
                errlog(`Editing company failed ->\n`);
                console.log(err);
                res.status(500).end();
            });
        ;
    });

    //-------------
    // Delete Company
    //-------------
    router.post('/delete', validator(deleteCompanySchema, models), (req, res) => { //
        models.Company.findByIdAndDelete(req.body.id)
            .then(result => result ? res.status(200).json(result) : res.status(404).end())
            .catch(err => {
                errlog(`Deleting company failed ->\n`);
                console.log(err);
                res.status(500).end();
            });
        ;
    });


    return router;
};