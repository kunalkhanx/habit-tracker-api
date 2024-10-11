const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entry_on: {
        type: Date,
        required: true
    },
    entry_value: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false,
        default: null,
        maxLength: 1000
    },
    status: {
        type: Number,
        default: 1
    }
    
}, {timestamps: true})

const HabitEntry = mongoose.model('HabitEntry', schema)
module.exports = HabitEntry