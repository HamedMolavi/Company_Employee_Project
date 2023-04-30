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
                errlog(err);
                return res.status(500).end();
            });
    });


    //-------------
    // Get Emplyees
    //-------------
    // altimately sends employee(s) info along with their company(s) info, using inner join
    router.get('/employee', (req, res) => { // add priviliges using session
        const { searchBy } = req.query;
        models.Employee.aggregate([
            {
                $lookup: {
                    from: "companies", // collection name in db
                    localField: "id_companies",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $match: {
                    $or: [
                        { 'company.companyname': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'company.registeredNumber': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'company.city': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'company.province': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'firstname': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'lastname': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'birthday': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'nationalID': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'gender': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                        { 'role': { $regex: RegExp(`.*${searchBy}.*`), $options: "i" } },
                    ]
                }
            }
        ])
            .then((results) => { // returns an array for the first two and an object for the last one.
                return !!results ? res.status(200).json(results) : res.status(404).end();
            })
            .catch((err) => {
                errlog(`Reading from database\n`);
                errlog(err)
                return res.status(500).end();
            });


        /*
    // search by a key sent from client side
    !!Object.values(req.query)[0] && !req.query.companyname && !req.query.id_company
        `{Object.keys(req.query)[0]}=${req.query[Object.keys(req.query)[0]]}`
    // search by company name
    !!req.query.companyname
        `{companyname : req.query.companyname}`
    // search by company's id
    !!req.query.id_company
        `{comp.id : req.query.id_company}`
    // get all employees
        find()
        */
    });

    return router
};