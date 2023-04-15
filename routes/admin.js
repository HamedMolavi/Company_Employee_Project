const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);


module.exports = function ({ database }) {
    //-------------
    // Get Companies
    //-------------
    router.get('/company', (req, res) => { // add priviliges using session
        let searchQuery;
        !!req.query.searchBy
            // search among companies
            ? searchQuery = [`
            SELECT * FROM companies  WHERE 		id			LIKE '%${req.query.searchBy}%'
                                        OR companyname		LIKE '%${req.query.searchBy}%'
                                        OR registeredNumber	LIKE '%${req.query.searchBy}%'
                                        OR city				LIKE '%${req.query.searchBy}%'
                                        OR province			LIKE '%${req.query.searchBy}%'
                                        OR tel				LIKE '%${req.query.searchBy}%'
                                        OR website			LIKE '%${req.query.searchBy}%';`]
            : !!req.query.id
                // search by id
                ? searchQuery = ['SELECT * FROM `companies` where `id`=? order by id', [req.query.id]]
                // get all the companies
                : searchQuery = ['SELECT * FROM `companies` order by id']
        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).end();
            })
            .catch(err => {
                errlog(`Reading from database\n`, err);
                res.status(500).end();
            });
        ;
    });


    //-------------
    // Get Emplyees
    //-------------
    router.get('/employee', (req, res) => { // add priviliges using session
        let searchQuery; // altimately sends employee(s) info along with their company(s) info, using inner join
        !!req.query.searchBy
            // search among employees
            ? searchQuery = [`
            SELECT emp.*, comp.companyname FROM employees	as emp join companies as comp on emp.id_companies = comp.id
                                    WHERE	emp.id				LIKE '%${req.query.searchBy}%'
                                    OR comp.companyname			LIKE '%${req.query.searchBy}%'
                                    OR comp.registeredNumber	LIKE '%${req.query.searchBy}%'
                                    OR comp.city				LIKE '%${req.query.searchBy}%'
                                    OR comp.province			LIKE '%${req.query.searchBy}%'
                                    OR emp.firstname			LIKE '%${req.query.searchBy}%'
                                    OR emp.lastname				LIKE '%${req.query.searchBy}%'
                                    OR emp.birthday				LIKE '%${req.query.searchBy}%'
                                    OR emp.nationalID			LIKE '%${req.query.searchBy}%'
                                    OR emp.gender				LIKE '%${req.query.searchBy}%'
                                    OR emp.role					LIKE '%${req.query.searchBy}%';`]
            : !!Object.values(req.query)[0] && !req.query.companyname && !req.query.id_company
                // search by a key sent from client side
                ? searchQuery = [`SELECT emp.*, comp.companyname FROM employees as emp join companies as comp on emp.id_companies = comp.id where emp.${Object.keys(req.query)[0]}=${req.query[Object.keys(req.query)[0]]} order by id`]
                : !!req.query.companyname
                    // search by company name
                    ? searchQuery = ['SELECT emp.*, comp.companyname FROM employees as emp join companies as comp on emp.id_companies = comp.id where comp.companyname = ?', [req.query.companyname]]
                    : !!req.query.id_company
                        // search by company's id
                        ? searchQuery = ['SELECT emp.*, comp.companyname FROM employees as emp join companies as comp on emp.id_companies = comp.id where comp.id = ?', [req.query.id_company]]
                        // get all employees
                        : searchQuery = ['SELECT emp.*, comp.companyname FROM `employees` as emp join companies as comp on emp.id_companies = comp.id'];

        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).end();
            })
            .catch(err => {
                errlog(`Reading from database\n`, err);
                res.status(500).end();
            });
        ;
    });

    return router
};