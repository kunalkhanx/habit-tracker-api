const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 50
    }
})