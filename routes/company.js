const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const { validator } = require('../validation/index');
const { creatCompanySchema, editCompanySchema, deleteCompanySchema } = require('../validation/company');
const errlog = require('../utils/log').errlog(__filename);


module.exports = function ({ database }) {

    //-------------
    // Creat Company
    //-------------
    router.post('/', validator(creatCompanySchema), (req, res) => {
        let now = new Date();
        let searchQuery
            = 'INSERT INTO `companies` (`companyname`, `registeredNumber`, `city`, `province`, `tel`, `avatar`, `createdAt`) VALUES ('
            + `'${req.body.companyname}', '${req.body.registeredNumber}', '${req.body.city}','${req.body.province}','${req.body.tel}', ${req.body.avatar || '/Images/icons/companies/logo.png'}, '${now.getFullYear()}-${now.getMonth()}-${now.getDate()}')`;
        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).end();
            })
            .catch(err => {
                errlog(`Creating company failed ->\n`, err);
                err.errno === 1062
                    ? res.status(406).end()
                    : res.status(500).end();
            });
        ;
    });


    //-------------
    // Edit Company
    //-------------
    router.post('/edit', validator(editCompanySchema, database), (req, res) => {
        let searchQuery
        !!req.body.registeredNumber
            ? searchQuery
            = ['UPDATE `companies` SET `companyname` = ?, `registeredNumber` = ?, `city` = ?, `province` = ?, `tel` = ?, `avatar` = ? WHERE (`id` = ?)',
                [req.body.companyname, req.body.registeredNumber, req.body.city, req.body.province, req.body.tel, req.body.avatar, req.body.id]]
            : searchQuery
            = ['UPDATE `companies` SET `companyname` = ?, `city` = ?, `province` = ?, `tel` = ?, `avatar` = ? WHERE (`id` = ?)',
                [req.body.companyname, req.body.city, req.body.province, req.body.tel, req.body.avatar, req.body.id]];

        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).end();
            })
            .catch(err => {
                errlog(`Editing company failed ->\n`, err);
                res.status(500).end();
            });
        ;
    });

    //-------------
    // Delete Company
    //-------------
    router.post('/delete', validator(deleteCompanySchema, database), (req, res) => {
        let searchQuery
            = ['DELETE FROM `companies` WHERE (`id` =?)', [req.body.id]];

        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).end();
            })
            .catch(err => {
                errlog(`Deleting company failed ->\n`, err);
                res.status(500).end();
            });
        ;
    });


    return router;
};