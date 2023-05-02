const creatCompanySchema = [
    {
        name: "companyname",
        required: true,
        minlength: [2, "Username is too short (more than 2 characters)."],
    },
    {
        name: "registeredNumber",
        required: true,
        pattern: [/^\d{1,}$/, "Invalid Format of Registration Number."]
    },
    {
        name: "city",
        minlength: [3, "city is too short (more than 2 characters)."],
        maxlength: [40, "city is too large (less than 40 characters)."],
    },
    {
        name: "province",
        minlength: [3, "province is too short (more than 2 characters)."],
        maxlength: [40, "province is too large (less than 40 characters)."],
    },
    {
        name: "tel",
        required: true,
        pattern: [/^\+?\d{1,}$/, "Invalid Format of Telephone."]
    }
];

const editCompanySchema = [
    {
        name: "companyname",
        minlength: [2, "Username is too short (more than 2 characters)."],
    },
    {
        name: "registeredNumber",
        pattern: [/^\d{1,}$/, "Invalid Format of Registration Number."]
    },
    {
        name: "city",
        minlength: [3, "city is too short (more than 2 characters)."],
        maxlength: [40, "city is too large (less than 40 characters)."],
    },
    {
        name: "province",
        minlength: [3, "province is too short (more than 2 characters)."],
        maxlength: [40, "province is too large (less than 40 characters)."],
    },
    {
        name: "tel",
        pattern: [/^\+?\d{1,}$/, "Invalid Format of Telephone."]
    }
];



const deleteCompanySchema = [
    {
        name: "id",
        required: true,
    }
];


module.exports = { creatCompanySchema, editCompanySchema, deleteCompanySchema };