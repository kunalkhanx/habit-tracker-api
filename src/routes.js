const express = require('express')
const auth = require('./app/auth.routes')
const habit = require('./app/habit.routes')
const habitEntry = require('./app/habit-entries.routes')
const profile = require('./app/profile.routes')

const router = express.Router()

router.use('/auth', auth)                   // Auth Routes
router.use('/habit', habit)                 // Habit Routes
router.use('/habit/entry', habitEntry)      // Habit Entries Routes
router.use('/profile', profile)             // Profile routes

module.exports = router