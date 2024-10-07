const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100
    },
    description: {
        type: String,
        required: false,
        default: null,
        maxLength: 1024
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    has_target: {
        type: Boolean,
        default: true
    },
    target_unit: {
        type: String,
        default: 'Unit'
    },
    target: {
        type: Number,
        default: 0
    },
    frequency: {
        type: String,
        default: 'Daily'
    },
    status: {
        type: Number,
        default: 1
    },
    meta: {
        type: Object,
        default: null
    }
}, {timestamps: true})

const Habit = mongoose.model('Habit', schema)
module.exports = Habit