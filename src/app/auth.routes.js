const express = require('express')
const {body} = require('express-validator')

const router = express.Router()

router.post('/register', async (req, res) => {
    try{
        const result = body('name').isLength({min: 3})
        console.log(result)
        return res.json({
            code: 201,
            message: 'Request Complete!',
            result: result
        })
    }catch(e){
        console.log(e)
        return res.json({
            code: 500,
            message: 'Request Error!'
        })
    }
});

module.exports = router