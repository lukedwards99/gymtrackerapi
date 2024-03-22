const express = require("express")
const router = express.Router()
const logger = require("../common/logging")
const {getWorkouts, getWorkout, insertWorkout, getWorkoutTypes, putWorkoutType, deleteWorkoutType, deleteWorkout, getWorkoutTypesActive, patchWorkout } = require("../db/workoutdb")

router.route('/type/active')
    .get((req, res) => {
        getWorkoutTypesActive().then(workoutsTypes => {
            res.json(workoutsTypes)
        })
    })

router.route("/type")
    .get((req, res) => {
        getWorkoutTypes().then(workoutsTypes => {
            res.json(workoutsTypes)
        })
    })
    .put((req, res) => {
        putWorkoutType(req.body.name).then(returnObject => {
            res.json(returnObject)
        })
    })
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