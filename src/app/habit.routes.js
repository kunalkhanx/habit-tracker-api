const express = require('express')
const debug = require('../utils/debug')
const Joi = require('joi')
const Habit = require('../models/Habit')
const auth = require('../middlewares/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    try{

        const schema = Joi.object({
            name: Joi.string().required().min(2).max(100),
            description: Joi.string().optional().max(1024),
            has_target: Joi.boolean().optional().default(true),
            target_unit: Joi.string().optional(),
            target: Joi.number().optional().default(0),
            frequency: Joi.string().optional().valid('Daily', 'Weekly', 'Monthly', 'Yearly')
        })

        const result = schema.validate(req.body)
        if(result.error){
            const message = result.error.details[0].message
            return res.status(400).json({
                code: 400,
                message: 'Invalid input(s)',
                data: message
            })
        }

        const habit = new Habit({...result.value, user: req.user._id})
        await habit.save()

        return res.status(201).json({
            code: 201,
            message: 'Request Complete!',
            data: habit
        })

    }catch(e){
        debug.error(e)
        return res.status(500).json({
            code: 500,
            message: e._message ? e._message : 'Required failed!'
        })
    }
})


module.exports = router