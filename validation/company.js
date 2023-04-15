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
        required: true,
    },
    {
        name: "province",
        required: true,
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
        required: true,
        minlength: [2, "Username is too short (more than 2 characters)."],
    },
    {
        name: "registeredNumber",
        pattern: [/^\d{1,}$/, "Invalid Format of Registration Number."]
    },
    {
        name: "city",
        required: true,
    },
    {
        name: "province",
        required: true,
    },
    {
        name: "tel",
        required: true,
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