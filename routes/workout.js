const express = require("express")
const router = express.Router()
const logger = require("../common/logging")
const {getWorkouts} = require("../db/workoutdb")

router.use(logger)

//under workout/ route
router.route("/")
    .get((req, res) => {
        console.log("GET workout")
        getWorkouts().then(workouts => {
            res.json(JSON.stringify(workouts))
        })
    })


module.exports = router