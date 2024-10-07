const express = require('express')
const debug = require('../utils/debug')
const Joi = require('joi')
const Habit = require('../models/Habit')
const auth = require('../middlewares/auth')
const HabitEntry = require('../models/HabitEntry')

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try{
        const habits = await Habit.find({user: req.user._id})

        return res.status(200).json({
            code: 200,
            message: 'Request Complete!',
            data: habits
        })
    }catch(e){
        debug.error(e)
        return res.status(500).json({
            code: 500,
            message: e._message ? e._message : 'Required failed!'
        })
    }
})

router.get('/:habit', auth, async (req, res) => {
    try{
        const habit = await Habit.findOne({user: req.user._id, _id: req.params.habit})
        if(!habit){
            return res.status(404).json({
                code: 404,
                message: 'Habit not found!'
            }) 
        }
        const entries = await HabitEntry.find({habit: habit._id, user: req.user._id})
        if(!habit){
            return res.status(404).json({
                code: 404,
                message: 'Entry not found!'
            }) 
        }
        return res.status(200).json({
            code: 200,
            message: 'Request Complete!',
            data: {habit, entries}
        })
    }catch(e){
        debug.error(e)
        return res.status(500).json({
            code: 500,
            message: e._message ? e._message : 'Required failed!'
        })
    }
})

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

router.patch('/:habit', auth, async (req, res) => {
    try{

        const schema = Joi.object({
            name: Joi.string().optional().min(2).max(100),
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

        const habit = await Habit.findById(req.params.habit)

        if(!habit){
            return res.status(404).json({
                code: 404,
                message: 'Habit not found!'
            }) 
        }

        for(let value in result.value){
            habit[value] = result.value[value]
        }

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

router.delete('/:habit', auth, async (req, res) => {
    try{
        const habit = await Habit.findOne({user: req.user._id, _id: req.params.habit})

        if(!habit){
            return res.status(404).json({
                code: 404,
                message: 'Habit not found!'
            }) 
        }

        await Habit.deleteOne({_id: habit._id})
        await HabitEntry.deleteMany({habit: habit._id})

        return res.status(200).json({
            code: 200,
            message: 'Request Complete!'
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