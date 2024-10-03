const express = require('express')
const auth = require('./app/auth.routes')

const router = express.Router()

router.use('/auth', auth) // Auth Routes

module.exports = router