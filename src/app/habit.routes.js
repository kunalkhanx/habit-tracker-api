const express = require('express')
const Joi = require('joi')
const moment = require('moment');
const debug = require('../utils/debug')
const Habit = require('../models/Habit')
const auth = require('../middlewares/auth')
const HabitEntry = require('../models/HabitEntry')

const router = express.Router()

/**
*    Get all Habits
*/
router.get('/', auth, async (req, res) => {
    try{
        const skip = req.query.skip ? req.query.skip : 0
        const limit = req.query.limit ? req.query.limit : 500

        const habits = await Habit.find({user: req.user._id}).skip(skip).limit(limit)

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

/**
*    Get Habit & Entries
*/
router.get('/:habit', auth, async (req, res) => {
    try{
        const habit = await Habit.findOne({user: req.user._id, _id: req.params.habit})
        if(!habit){
            return res.status(404).json({
                code: 404,
                message: 'Habit not found!'
            }) 
        }

        const skip = req.query.skip ? req.query.skip : 0
        const limit = req.query.limit ? req.query.limit : 500

        const query = {
            habit: habit._id, 
            user: req.user._id, 
            entry_on: {$gte: moment(req.query.start_date ? req.query.start_date : undefined).startOf('day').toDate()}
        }

        if(req.query.end_date){
            query.entry_on.$lte = moment(req.query.end_date).endOf('day').toDate()
        }

        const entries = await HabitEntry.find(query).skip(skip).limit(limit)
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

/**
*    Create new Habit
*/
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

/**
*    Update existing Habit
*/
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

/**
*    Delete existing Habit
*/
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