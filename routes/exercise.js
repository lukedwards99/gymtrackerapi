const express = require("express")
const router = express.Router()
const {insertExercises, removeExercise} = require("../db/exercisedb")

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