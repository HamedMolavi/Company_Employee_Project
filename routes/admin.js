const express = require('express');
const router = express.Router();
const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);
const { searchByField } = require('../database/queries');

module.exports = function ({ models }) {
    //-------------
    // Get Companies
    //-------------
    router.get('/company', (req, res) => { // add priviliges using session
        const { searchBy } = req.query;
        (function () {
            if (!!req.query.searchBy) return searchByField(models.Company, searchBy, ["companyname", "registeredNumber", "city", "province", "tel", "website"]);
            else if (!!req.query.id) return models.Company.findById(req.query.id);
            else return models.Company.find();
        })()
            .then((results) => { // returns an array for the first two and an object for the last one.
                return !!results ? res.status(200).json(results) : res.status(404).end();
            })
            .catch((err) => {
                errlog(`Reading from database\n`);
                console.log(err);
                return res.status(500).end();
            });
    });


    //-------------
    // Get Emplyees
    //-------------
    // altimately sends employee(s) info along with their company(s) info, using inner join
    router.get('/employee', (req, res) => { // add priviliges using session
        const { searchBy } = req.query;
        const companyFields = ['companyname', 'registeredNumber', 'city', 'province'];
        const fields = [...companyFields.map((el) => 'companies.' + el), 'firstname', 'lastname', 'birthday', 'nationalID', 'gender', 'role'];
        const query = Object.keys(req.query)[0];
        (function () {
            if (!!req.query.searchBy) return searchByField(models.Employee, searchBy, fields, { lookup: 'companies' });
            else if (!!req.query.id) return models.Employee.findById(req.query.id);
            else if (!!Object.values(req.query)[0]) return searchByField(models.Employee, req.query[Object.keys(req.query)[0]], !!companyFields.includes(query) ? 'companies.' + query : query, { lookup: 'companies' });
            else return models.Employee.aggregate([{
                $lookup: {
                    from: 'companies', // collection name in db
                    localField: 'id_companies',
                    foreignField: "_id",
                    as: 'companies'
                }
            }]);
        })()

            .then((results) => { // returns an array for the first two and an object for the last one.
                return !!results ? res.status(200).json(results) : res.status(404).end();
            })
            .catch((err) => {
                errlog(`Reading from database\n`);
                console.log(err);
                return res.status(500).end();
            });

    });

    return router
};