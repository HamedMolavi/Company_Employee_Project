const creatEmployeeSchema = [
    {
        name: "firstname",
        required: true,
        minlength: [3, "Firstname is too short (more than 2 characters)."],
        maxlength: [40, "Firstname is too large (less than 40 characters)."],
    },
    {
        name: "lastname",
        required: true,
        minlength: [3, "Firstname is too short (more than 2 characters)."],
        maxlength: [40, "Firstname is too large (less than 40 characters)."],
    },
    {
        name: "birthday",
        required: true,
        pattern: [/^\d{4}\-\d{2}\-\d{2}$/, "Invalid Format of Birthday (YYYY-MM-DD)."]
    },
    {
        name: "nationalID",
        required: true,
        pattern: [/^\d{1,10}$/, "Invalid Format of Registration Number."]
    },
    {
        name: "role",
        required: true,
        enum: ['manager', 'employee']
    },
    {
        name: "id_company",
        required: true,
        type: "id",
        ref: ["companies", "Company not found !"],
    }
];

const editEmployeeSchema = [
    {
        name: "firstname",
        required: true,
        minlength: [3, "Firstname is too short (more than 2 characters)."],
        maxlength: [40, "Firstname is too large (less than 40 characters)."],
    },
    {
        name: "lastname",
        required: true,
        minlength: [3, "Firstname is too short (more than 2 characters)."],
        maxlength: [40, "Firstname is too large (less than 40 characters)."],
    },
    {
        name: "birthday",
        required: true,
        pattern: [/^\d{4}\-\d{2}\-\d{2}$/, "Invalid Format of Birthday (YYYY-MM-DD)."]
    },
    {
        name: "nationalID",
        required: true,
        pattern: [/^\d{1,10}$/, "Invalid Format of Registration Number."]
    },
    {
        name: "role",
        required: true,
        enum: ['manager', 'employee']
    },
    {
        name: "companyname",
        required: true,
        validation: true,
        ref: ['admins', 'Not Authorized to change registeredNumber'],
    },
    {
        name: "gender",
        required: true,
        enum: ['male', 'female']
    },
];




const deleteEmployeeSchema = [
    {
        name: "id",
        validation: true,
        required: true,
        ref: ['admins', 'Not Authorized to delete an employee']
    }
];

module.exports = { creatEmployeeSchema, editEmployeeSchema, deleteEmployeeSchema };