const express = require("express")
const router = express.Router()
const { insertExercises, getExercisesForWorkout, removeExercise } = require("../db/exerciseselectiondb")

router.route("/:id")
    .get((req, res) => {
        getExercisesForWorkout(req.params.id).then(exercises => {
            res.json(exercises)
        })
    })
    .put((req, res) => {
        body = req.body
        insertExercises(req.params.id, body.exercise_name_id, body.reps, 
                        body.difficulty, body.stimulation)
        .then(success => {
            res.json({success: success ? true : false})
        })
    })
    .delete((req, res) => {
        body = req.body
        removeExercise(body.exercise_selection_id)
        .then(success => {
            res.json({success: success ? true : false})
        })
    })




module.exports = router