const express = require("express")
const router = express.Router()
const { getSetsForExercise, insertSet, deleteSet, moveSetUp, moveSetDown } = require("../db/setdb.js")

router.route("/up")
    .post((req, res) => {
        moveSetUp(req.body.set_id).then(resMessage => {
            res.json(resMessage)
        })
    })

router.route("/down")
    .post((req, res) => {
        moveSetDown(req.body.set_id).then(resMessage => {
            res.json(resMessage)
        })
    })

router.route("/:id")
    .get((req, res) => {
        getSetsForExercise(req.params.id).then(sets => {
            res.json(sets)
        })
    })

router.route("/")
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