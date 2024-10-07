const express = require('express')
const auth = require('../middlewares/auth')
const Habit = require('../models/Habit')
const HabitEntry = require('../models/HabitEntry')
const Joi = require('joi')
const debug = require('../utils/debug')

const router = express.Router()

router.post('/:habit', auth, async (req, res) => {
    try{

        const schema = Joi.object({
            entry_on: Joi.date().required(),
            entry_value: Joi.string().required()
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

        const habit = await Habit.findOne({user: req.user._id, _id: req.params.habit})
        if(!habit){
            return res.status(404).json({
                code: 404,
                message: 'Habit not found!'
            })
        }
        const entry = new HabitEntry({...result.value, user: req.user._id, habit: habit._id})
        await entry.save()

        return res.status(201).json({
            code: 201,
            message: 'Request Complete!',
            data: entry
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