const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Username is too short (more than 3 characters)."],
        maxlength: [20, "Username is too long (less than 20 characters)."],
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password is too short (more than 8 characters)."],
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female', 'other']
    },
    active: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("User", UserSchema)