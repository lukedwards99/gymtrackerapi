const express = require("express")
const router = express.Router()
const logger = require("../common/logging")
const {getWorkouts, getWorkout, insertWorkout, getWorkoutTypes, putWorkoutType, deleteWorkoutType} = require("../db/workoutdb")

router.route("/type")
    .get((req, res) => {
        getWorkoutTypes().then(workoutsTypes => {
            res.json(workoutsTypes)
        })
    }).put((req, res) => {
        putWorkoutType(req.body.name).then(success => {
            res.json({success: success ? true : false})
        })
    }).delete((req, res) => {
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
        insertWorkout(w.workout_time, w.workout_title, w.workouttype_id).then(success => {
            res.json({success: success ? true : false})
        })
    })

router.route("/:id")
    .get((req, res) => {
        getWorkout(req.params.id).then(workout => {
            res.json(workout)
        })
    })




module.exports = router