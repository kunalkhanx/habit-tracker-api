const express = require('express');
const User = require('../models/User');
const Joi = require('joi');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

const router = express.Router()

router.post('/register', async (req, res) => {
    try{

        const schema = Joi.object({
            first_name: Joi.string().required().regex(/^[A-Za-z]+$/).min(2).max(50).messages({'string.pattern.base': 'First name should contain only alphabets' }),
            last_name: Joi.string().optional().regex(/^[A-Za-z\s]+$/).max(50).messages({'string.pattern.base': 'Last name should contain only alphabets & spaces' }),
            email: Joi.string().required().email().min(4).max(50),
            password: Joi.string().required().min(8),
            sex: Joi.string().optional().valid('male', 'female', 'others'),
            dob: Joi.date().optional()
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

router.post('/login', async (req, res) => {
    try{
        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })

        const result = schema.validate(req.body)
        if(result.error){
            const message = result.error.details[0].message
            return res.status(400).json({
                code: 400,
                message: message
            })
        }

        const user = await User.findOne({email: result.value.email})

        if(!user){
            return res.status(401).json({
                code: 401,
                message: 'Invalid email or password!'
            })
        }

        const isPasswordMatch = await bcrypt.compare(result.value.password + process.env.APP_KEY, user.password)

        if(!isPasswordMatch){
            return res.status(401).json({
                code: 401,
                message: 'Invalid email or password!'
            })
        }

        const expire = 60*60

        const jwt_token = jwt.sign({
            email: user.email,
        }, process.env.APP_KEY, {expiresIn: expire})

        const token = new Token({token: jwt_token, expire, reference: `USER_LOGIN:${user.id}`})
        await token.save()

        return res.json({
            code: 201,
            message: 'Request Complete!',
            data: user,
            token
        })

    }catch(e){
        console.log(e)
        return res.json({
            code: 500,
            message: e._message ? e._message : 'Required failed!'
        })
    }
})

module.exports = router