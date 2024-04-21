const express = require("express")
const router = express.Router()
const logger = require("../common/logging")
const {getWorkouts, getWorkout, insertWorkout, getWorkoutTypes, putWorkoutType, deleteWorkoutType, deleteWorkout, getWorkoutTypesActive, patchWorkout } = require("../db/workoutdb")
const { body, matchedData, validationResult } = require('express-validator');

const putWorkoutValidator = () => 

router.route('/type/active')
    .get((req, res) => { // no input so no need for validation
        getWorkoutTypesActive().then(workoutsTypes => {
            res.json(workoutsTypes)
        })
    })

router.route("/type")
    .get((req, res) => { //no input
        getWorkoutTypes().then(workoutsTypes => {
            res.json(workoutsTypes)
        })
    })
    .put(body("name").trim().notEmpty().escape(),
        (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                res.send({ success:false, errors: result.array() });
            }
            const data = matchedData(req);
            // console.log(JSON.stringify(data))
            putWorkoutType(data.name).then(returnObject => {
                res.json(returnObject)
            })
        }
    )
    .delete((req, res) => {
        deleteWorkoutType(req.body.workout_type_id).then(success => {
            res.json({success: success ? true : false})
        })
    })
    
    
router.route("/")
    .get((req, res) => {
        getWorkouts().then(workouts => {
            res.json(workouts)
        })
    })
    .put((req, res) => {
        const w = req.body
        insertWorkout(w.workout_time, w.workout_title, w.workouttype_id, w.day_number).then(success => {
            res.json({success: success ? true : false})
        })
    })
    .delete((req, res) => {
        deleteWorkout(req.body.workout_id).then(success => {
            res.json({success: success ? true : false})
        })
    })

router.route("/:id")
    .get((req, res) => {
        getWorkout(req.params.id).then(result => {
            res.json(result)
        })
    })
    .patch((req, res) => {
        const w = req.body
        patchWorkout(req.params.id, w.workout_time, w.workout_title, w.workouttype_id, w.day_number).then(message => {
            res.json(message)
        })
    })




module.exports = router