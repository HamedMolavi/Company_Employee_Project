const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const { validator } = require('../validation/index');
const { creatCompanySchema, editCompanySchema, deleteCompanySchema } = require('../validation/company');


module.exports = function ({ database }) {

    //-------------
    // Creat Company
    //-------------
    router.post('/', validator(creatCompanySchema), (req, res) => {
        let searchQuery
            = 'INSERT INTO `companies` (`companyname`, `registeredNumber`, `city`, `province`, `tel`, `avatar`, `createdAt`) VALUES ('
            + `'${req.body.companyname}', '${req.body.registeredNumber}', '${req.body.city}','${req.body.province}','${req.body.tel}', ${req.body.avatar || '/Images/icons/companies/logo.png'}, '${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}')`;
        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).json({ success: false, message: 'Creating Company Faild.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                err.errno === 1062
                    ? res.status(200).json({ success: false, message: 'This company name exists.' })
                    : res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
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
                result.success ? res.status(200).json(result) : res.status(404).json({ success: false, message: 'Editting Company Faild.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
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
                result.success ? res.status(200).json(result) : res.status(404).json({ success: false, message: 'Deleting Company Faild.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;
    });


    return router;
};