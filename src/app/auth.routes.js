const express = require('express');
const User = require('../models/User');
const Joi = require('joi');

const router = express.Router()

router.post('/register', async (req, res) => {
    try{

        const schema = Joi.object({
            name: Joi.string().required().min(2).max(50),
            email: Joi.string().required().email().min(4).max(50),
            password: Joi.string().required().min(8)
        })

        const result = schema.validate(req.body)
        if(result.error){
            const message = result.error.details[0].message
            return res.status(400).json({
                code: 400,
                message: message
            })
        }

        const user = new User(result.value)
        await user.save()

        return res.json({
            code: 201,
            message: 'Request Complete!',
            data: user
        })
    }catch(e){
        console.log(e)
        return res.json({
            code: 500,
            message: e._message ? e._message : 'Required failed!'
        })
    }
});

module.exports = router