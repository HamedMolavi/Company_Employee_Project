const { dbQueryPromise } = require('../database/queryPromises');

const SchemaError = function (field, message) {
    this.field = field;
    this.message = message;
};



function validator(schema, db) {
    return async function (req, res, next) {
        const errors = [];
        for (const schemaField of schema) {
            const fieldValue = req.body[schemaField.name];
            if (!fieldValue) {
                if (schemaField.required) {
                    errors.push(new SchemaError(schemaField.name, `${schemaField.name} is required.`));
                };
                continue;
            };

            if (!!schemaField.enum) {
                if (!schemaField.enum.includes(fieldValue)) {
                    errors.push(new SchemaError(schemaField.name, `${schemaField.name} should be ${schemaField.enum.join(' or ')}.`));
                };
            };
            if (!!schemaField.minlength) {
                if (fieldValue.length < schemaField.minlength[0]) {
                    errors.push(new SchemaError(schemaField.name, schemaField.minlength[1]));
                };
            };
            if (!!schemaField.maxlength) {
                if (fieldValue.length > schemaField.maxlength[0]) {
                    errors.push(new SchemaError(schemaField.name, schemaField.maxlength[1]));
                };
            };
            if (!!schemaField.pattern) {
                if (!schemaField.pattern[0].test(fieldValue)) {
                    errors.push(new SchemaError(schemaField.name, schemaField.pattern[1]));
                };
            };
            if (!!schemaField.validation) {
                if (!req.body.username || !req.body.password) return res.json({ success: false, message: "Not Authorized." });
                await dbQueryPromise(db, ['SELECT id FROM `' + schemaField.ref[0] + '` where username=? and password=?', [req.body.username, req.body.password]])
                    .then((result) => {
                        if (!result.success) {
                            errors.push(new SchemaError(schemaField.name, schemaField.ref[1]));
                        };
                    })
                    .catch((err) => {
                        console.log('error in validating', schemaField.ref[0], 'to edit ', schemaField.name);
                        console.log(err);
                        return res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
                    });
                ;
            }
            if (schemaField.type === 'id' && !!schemaField.ref) {
                await dbQueryPromise(db, 'SELECT id FROM `' + schemaField.ref[0] + '` where id=' + req.body[schemaField.name])
                    .then((result) => {
                        if (!result.success) {
                            errors.push(new SchemaError(schemaField.name, schemaField.ref[1]));
                        };
                    })
                    .catch((err) => {
                        console.log('error in search query for id = ', req.body[schemaField.name], ' in ', schemaField.ref[0]);
                        console.log(err);
                        return res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
                    });
            };
        };
        if (errors.length !== 0) {
            console.log(errors);
            return res.json({ success: false, message: errors[0].message });
        };
        next();
    };
};

module.exports = { validator };