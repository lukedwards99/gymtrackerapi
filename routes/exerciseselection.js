const express = require("express")
const router = express.Router()
const { insertExercises, getExercisesForWorkout, removeExercise, moveExerciseUp, moveExerciseDown } = require("../db/exerciseselectiondb")

router.route("/up")
    .post((req, res) => {
        moveExerciseUp(req.body.exercise_selection_id).then(resMessage => {
            res.json(resMessage)
        })
    })

router.route("/down")
    .post((req, res) => {
        moveExerciseDown(req.body.exercise_selection_id).then(resMessage => {
            res.json(resMessage)
        })
    })

// TODO REMOVE THE ID AND MOVE TO BODY
router.route("/:id")
    .get((req, res) => {
        getExercisesForWorkout(req.params.id).then(exercises => {
            res.json(exercises)
        })
    })
    .put((req, res) => {
        body = req.body
        insertExercises(req.params.id, body.exercise_name_id, body.order)
        .then(success => {
            res.json({success: success ? true : false})
        })
    })

router.route("/")
    .delete((req, res) => {
        body = req.body
        removeExercise(body.exercise_selection_id)
        .then(success => {
            res.json({success: success ? true : false})
        })
    })
module.exports = router