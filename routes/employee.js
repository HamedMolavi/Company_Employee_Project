const express = require('express');
const router = express.Router();
const { validator } = require('../validation/index');
const { creatEmployeeSchema, editEmployeeSchema, deleteEmployeeSchema } = require('../validation/employee');
const errlog = require('../utils/log').errlog(__filename);

module.exports = function ({ models }) {

    //-------------
    // Creat Employee
    //-------------
    router.post('/', validator(creatEmployeeSchema, models), (req, res) => {
        let icon;
        req.body.gender === 'femmale'
            ? icon = '/Images/icons/employees/woman-icon.png'
            : icon = '/Images/icons/employees/man-icon.png';
        const employee = new models.Employee({
            id_companies: req.body.id_companies,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthday: req.body.birthday,
            nationalID: req.body.nationalID,
            gender: req.body.gender || 'male',
            role: req.body.role || 'employee',
            avatar: req.body.avatar || icon,
            about: req.body.about || "There is no description."
        });
        employee.save()
            .then(result => {
                result ? res.status(200).json(result) : res.status(404).end();
            })
            .catch(err => {
                errlog(`Creating employee failed. ->\n`);
                console.log(err);
                err.errno === 11000
                    ? res.status(406).end()
                    : res.status(500).end();
            });
        ;
    });





    //-------------
    // Delete Employee
    //-------------
    router.delete('', validator(deleteEmployeeSchema, models), (req, res) => {
        models.Employee.findByIdAndDelete(req.body.id)
            .then(result => {
                result ? res.status(200).json(result) : res.status(404).end();
            })
            .catch(err => {
                errlog(`Deleting employee failed. ->\n`);
                console.log(err);
                res.status(500).end();
            });
        ;
    });



    //-------------
    // Edit Employee
    //-------------
    router.put('', validator(editEmployeeSchema, models), (req, res) => {
        models.Employee.findByIdAndUpdate(req.body.id, {
            id_companies: req.body.id_companies,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthday: req.body.birthday,
            nationalID: req.body.nationalID,
            gender: req.body.gender,
            role: req.body.role,
            avatar: req.body.avatar,
            about: req.body.about,
        })
            .then(result => {
                result ? res.status(200).json(result) : res.status(404).end();
            })
            .catch(err => {
                errlog('Reading from database ->\n')
                console.log(err);
                res.status(500).end();
            });
        ;
    });


    return router;
};