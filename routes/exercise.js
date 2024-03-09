const express = require("express")
const router = express.Router()
const { getExerciseCategory, putExerciseCategory, deleteExerciseCategory, getExerciseCategoryActive} = require("../db/exercisedb")

router.route("/type/active")
    .get((req, res) => {
        getExerciseCategoryActive().then(workoutsTypes => {
            res.json(workoutsTypes)
        })
    })
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

module.exports = router