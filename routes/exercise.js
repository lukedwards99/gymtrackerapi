const express = require("express")
const router = express.Router()
const {insertExercises, removeExercise, getExerciseCategory, putExerciseCategory, deleteExerciseCategory} = require("../db/exercisedb")

router.route("/type")
    .get((req, res) => {
        getExerciseCategory().then(workoutsTypes => {
            res.json(workoutsTypes)
        })
    }).put((req, res) => {
        putExerciseCategory(req.body.name).then(success => {
            res.json({success: success ? true : false})
        })
    }).delete((req, res) => {
        deleteExerciseCategory(req.body.exercise_type_id).then(success => {
            res.json({success: success ? true : false})
        })
    })

router.route("/")
    .put((req, res) => {
        body = req.body
        insertExercises(body.workout_id, body.exercise_name_id, body.reps, 
                        body.difficulty, body.stimulation)
        .then(success => {
            res.json({success: success ? true : false})
        })
    }).delete((req, res) => {
        body = req.body
        removeExercise(body.workout_exercise_id)
        .then(success => {
            res.json({success: success ? true : false})
        })
    })




module.exports = router