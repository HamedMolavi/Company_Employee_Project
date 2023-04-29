const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    companyname: {
        type: String,
        required: true,
        minlength: [3, "First name is too short (more than 3 characters)."],
    },
    registeredNumber: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
    province: {
        type: String,
    },
    tel: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    }
});


module.exports = mongoose.model("Companies", CompanySchema)