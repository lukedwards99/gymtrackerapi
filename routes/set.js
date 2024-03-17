const express = require("express")
const router = express.Router()
const { getSetsForExercise, insertSet, deleteSet} = require("../db/setdb.js")

// router.route("/up")
//     .post((req, res) => {
//         moveExerciseUp(req.body.exercise_selection_id).then(resMessage => {
//             res.json(resMessage)
//         })
//     })

// router.route("/down")
//     .post((req, res) => {
//         moveExerciseDown(req.body.exercise_selection_id).then(resMessage => {
//             res.json(resMessage)
//         })
//     })

router.route("/")
    .get((req, res) => {
        getSetsForExercise(req.body.exercise_selection_id).then(sets => {
            res.json(sets)
        })
    })
    .put((req, res) => {
        const body = req.body
        insertSet(body.exercise_selection_id, body.reps, body.difficulty_score, body.stimulation_score)
        .then(result => {
            res.json(result)
        })
    })
    .delete((req, res) => {
        const body = req.body
        deleteSet(body.set_id)
        .then(result => {
            res.json(result)
        })
    })

module.exports = router