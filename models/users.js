const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: '',
        trim: true
    },
    lastName: {
        type: String,
        default: '',
        trim: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: '/img/users/default.png'
    },
    email: {
        type: String,
        default: ''
    },
    gender : {
        type: String,
        default: 'Male'
    }
}, { timestamps: true });

userSchema.virtual('fullName')
    .get(function() {
        return `${this.firstName} ${this.lastName}`;
    });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema); // User model