const express = require('express');
const router = express.Router();
const { dbQueryPromise } = require('../database/queryPromises');
const { validator } = require('../validation/index');
const { creatEmployeeSchema, editEmployeeSchema, deleteEmployeeSchema } = require('../validation/employee');


module.exports = function ({ database }) {


    router.get('/:id', (req, res) => {
        dbQueryPromise(database, ['SELECT * FROM `employees` where id=' + req.params.id.slice(1)])
            .then(result => {
                if (result.success) {
                    let data = result.results[0];
                    console.log(data);
                    return res.render('employee', data);
                };
                return res.status(404).json({ success: result.success, message: 'Employee not found.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                err.errno === 1062
                    ? res.status(200).json({ success: false, message: 'This employee name exists.' })
                    : res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;

    });


    //-------------
    // Creat Employee
    //-------------
    router.post('/', validator(creatEmployeeSchema, database), (req, res) => {
        let icon;
        req.body.gender === 'femmale'
            ? icon = '/Images/icons/employees/woman-icon.png'
            : icon = '/Images/icons/employees/man-icon.png';
        let searchQuery
            = 'INSERT INTO `employees` (`id_companies`, `firstname`, `lastname`, `birthday`, `nationalID`, `gender`, `role`, `avatar`) VALUES ('
            + `'${req.body.id_company}', '${req.body.firstname}', '${req.body.lastname}','${req.body.birthday}','${req.body.nationalID}', '${req.body.gender || 'male'}', '${req.body.role || employee}', '${req.body.avatar || icon}')`;
        console.log(searchQuery);
        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).json({ success: false, message: 'Creating Employee Faild.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                err.errno === 1062
                    ? res.status(200).json({ success: false, message: 'This employee name exists.' })
                    : res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;
    });





    //-------------
    // Delete Employee
    //-------------
    router.post('/delete', validator(deleteEmployeeSchema, database), (req, res) => {
        let searchQuery
            = ['DELETE FROM `employees` WHERE (`id` =?)', [req.body.id]];

        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).json({ success: false, message: 'Deleting Employee Faild.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;
    });



    //-------------
    // Edit Company
    //-------------
    router.post('/edit', validator(editEmployeeSchema, database), (req, res) => {
        let searchQuery//UPDATE `employees` SET `id_companies` = '1', `firstname` = '1', `lastname` = '1', `birthday` = '1', `nationalID` = '1', `gender` = '1', `role` = '1', `avatar` = '1', `about` = '1' WHERE (`id` = '17') and (`id_companies` = '7');

        !!req.body.companyname
            ? searchQuery
            = ['UPDATE `employees` SET `id_companies` = ?, `firstname` = ?, `lastname` = ?, `birthday` = ?, `nationalID` = ?, `gender` = ?, `role` = ?, `avatar` = ?, `about` = ? WHERE (`id` = ?)',
                [req.body.companyname, req.body.firstname, req.body.lastname, req.body.birthday, req.body.nationalID, req.body.gender, req.body.role, req.body.avatar, req.body.about, req.body.id]]
            : searchQuery
            = ['UPDATE `employees` SET `firstname` = ?, `lastname` = ?, `birthday` = ?, `nationalID` = ?, `gender` = ?, `role` = ?, `avatar` = ?, `about` = ? WHERE (`id` = ?)',
                [req.body.firstname, req.body.lastname, req.body.birthday, req.body.nationalID, req.body.gender, req.body.role, req.body.avatar, req.body.about, req.body.id]]

        dbQueryPromise(database, searchQuery)
            .then(result => {
                result.success ? res.status(200).json(result) : res.status(404).json({ success: false, message: 'Editting Employee Faild.' });
            })
            .catch(err => {
                console.log(`Reading from database (${__filename})\n`, err);
                res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
            });
        ;
    });


    return router;
};