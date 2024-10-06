const express = require('express')
const auth = require('./app/auth.routes')
const habit = require('./app/habit.routes')

const router = express.Router()

router.use('/auth', auth)       // Auth Routes
router.use('/habit', habit)     // Habit Routes

module.exports = router