const express = require('express')
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('./utils/database')
mongoose.connect(process.env.DB_PATH)

const routes = require('./routes')

const app = express()

app.use(routes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})