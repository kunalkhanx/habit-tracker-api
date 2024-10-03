const mongoose = require('mongoose')
const validator = require('validator')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        validate: (value) => {
            if(!validator.isAlpha(value)){
                throw new Error('Invalid name.');
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        minLength: 5,
        maxLength: 50,
        validate: (value) => {
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    status: {
        type: Number,
        default: 0
    }
})


const User = new mongoose.model('User', schema);
module.exports = User