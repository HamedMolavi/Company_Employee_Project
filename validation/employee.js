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
        name: "gender",
        required: true,
        enum: ['male', 'female']
    },
    {
        name: "id_companies",
        required: true,
        type: "id",
        ref: ["Company", "Company not found !"],
    },
    {
        name: "about",
        minlength: [3, "Description is too short (more than 2 characters)."],
        maxlength: [250, "Description is too large (less than 40 characters)."],

    }
];

const editEmployeeSchema = [
    {
        name: "firstname",
        minlength: [3, "Firstname is too short (more than 2 characters)."],
        maxlength: [40, "Firstname is too large (less than 40 characters)."],
    },
    {
        name: "lastname",
        minlength: [3, "Firstname is too short (more than 2 characters)."],
        maxlength: [40, "Firstname is too large (less than 40 characters)."],
    },
    {
        name: "birthday",
        pattern: [/^\d{4}\-\d{2}\-\d{2}$/, "Invalid Format of Birthday (YYYY-MM-DD)."]
    },
    {
        name: "nationalID",
        pattern: [/^\d{1,10}$/, "Invalid Format of Registration Number."]
    },
    {
        name: "role",
        enum: ['manager', 'employee']
    },
    {
        name: "id_companies",
        type: "id",
        ref: ["Company", "Company not found !"]
    },
    {
        name: "gender",
        enum: ['male', 'female']
    },
];




const deleteEmployeeSchema = [
    {
        name: "id",
        required: true,
    }
];

module.exports = { creatEmployeeSchema, editEmployeeSchema, deleteEmployeeSchema };