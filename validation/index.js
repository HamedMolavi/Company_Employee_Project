const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);



// constructor of a custom error for validating
const SchemaError = function (field, message) {
    this.field = field;
    this.message = message;
};



function validator(schema, models) {
    // returns a middleware with defaulted an schema and the database
    return async function (req, res, next) {
        const errors = []; // an array of errors through validating
        // checking privilidge validation
        if (!req.session.user || req.session.user.role !== 'admin') return res.status(401).end();

        for (const schemaField of schema) { // each field in the schema
            const fieldValue = req.body[schemaField.name]; // value in request responsible for the schema field
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
            if (schemaField.type === 'id' && !!schemaField.ref) { // Checking null references
                await models[schemaField.ref[0]].findById(req.body[schemaField.name])
                    .then((result) => {
                        if (!result) errors.push(new SchemaError(schemaField.name, schemaField.ref[1]));
                    })
                    .catch((err) => {
                        errlog('Error in validating ref param.\n');
                        console.log(err);
                        return res.status(500).end();
                    });
            };
        };
        if (errors.length !== 0) {
            errlog('Validation errors:\n');
            console.log(errors);
            return res.json({ success: false, message: errors[0].message }); // sending out the first error
        };
        next();
    };
};

module.exports = { validator };