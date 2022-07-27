const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const { readTicket, writeTicket } = require('../tools/tickets');


module.exports = function ({ database }) {
    //-------------
    // Change Day
    //-------------
    router.get('/changeDay', (req, res) => {
        let searchQuery = ["UPDATE admins SET `day` = ? WHERE (`username` = ?)", [req.query.day, req.query.username]];
        dbQueryPromise(database, searchQuery)
            .then(() => {
                return readTicket(req.query.ticket)
            })
            .then(data => {
                data.day = req.query.day;
                return writeTicket(JSON.stringify(data), req.query.ticket);
            })
            .then(() => res.end())
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                res.end();
            });
        ;
    });


    //-------------
    // Get Companies
    //-------------
    router.get('/company', (req, res) => {
        let searchQuery;
        !!req.query.searchBy
            ? searchQuery = [`
            SELECT * FROM companies  WHERE 		id			LIKE '%${req.query.searchBy}%'
                                        OR companyname		LIKE '%${req.query.searchBy}%'
                                        OR registeredNumber	LIKE '%${req.query.searchBy}%'
                                        OR city				LIKE '%${req.query.searchBy}%'
                                        OR province			LIKE '%${req.query.searchBy}%'
                                        OR tel				LIKE '%${req.query.searchBy}%'
                                        OR website			LIKE '%${req.query.searchBy}%';`]
            : !!req.query.id
                ? searchQuery = ['SELECT * FROM `companies` where `id`=? order by id', [req.query.id]]
                : searchQuery = ['SELECT * FROM `companies` order by id']
        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).json({ success: result.success, message: 'Company not found.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;
    });


    //-------------
    // Get Emplyees
    //-------------
    router.get('/employee', (req, res) => {
        let searchQuery;
        !!req.query.searchBy
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
                ? searchQuery = [`SELECT emp.*, comp.companyname FROM employees as emp join companies as comp on emp.id_companies = comp.id where emp.${Object.keys(req.query)[0]}=${req.query[Object.keys(req.query)[0]]} order by id`]
                : !!req.query.companyname
                    ? searchQuery = ['SELECT emp.*, comp.companyname FROM employees as emp join companies as comp on emp.id_companies = comp.id where comp.companyname = ?', [req.query.companyname]]
                    : !!req.query.id_company
                        ? searchQuery = ['SELECT emp.*, comp.companyname FROM employees as emp join companies as comp on emp.id_companies = comp.id where comp.id = ?', [req.query.id_company]]
                        : searchQuery = ['SELECT emp.*, comp.companyname FROM `employees` as emp join companies as comp on emp.id_companies = comp.id'];

        dbQueryPromise(database, searchQuery)
            .then(result => {
                if (result.success) {
                    return res.status(200).json(result);
                };
                res.status(404).json({ success: result.success, message: 'Employee not found.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;
    });

    return router
};