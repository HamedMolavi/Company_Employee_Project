const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    id_companies: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    firstname: {
        type: String,
        required: true,
        minlength: [3, "First name is too short (more than 3 characters)."],
    },
    lastname: {
        type: String,
        required: true,
        minlength: [3, "First name is too short (more than 3 characters)."],
    },
    birthday: {
        type: Date,
    },
    nationalID: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female', 'other']
    },
    role: {
        type: String,
    },
    website: {
        type: String,
    },
    avatar: {
        type: String
    }
});


module.exports = mongoose.model("Employees", EmployeeSchema)