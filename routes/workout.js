const express = require("express")
const router = express.Router()
const logger = require("../common/logging")
const {getWorkouts, getWorkout} = require("../db/workoutdb")

router.use(logger)

//under workout/ route
router.route("/")
    .get((req, res) => {
        getWorkouts().then(workouts => {
            res.json(JSON.stringify(workouts))
        })
    })
router.route("/:id")
    .get((req, res) => {
        getWorkout(req.params.id).then(workout => {
            res.json(JSON.stringify(workout))
        })
    })
    


module.exports = router