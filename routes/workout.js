const express = require("express")
const router = express.Router()
const logger = require("../common/logging")
const {getWorkouts} = require("../db/workoutdb")

router.use(logger)

//under workout/ route
router.route("/")
    .get((req, res) => {
        getWorkouts().then(workouts => {
            
        })
        res.send(`Get Workouts`)
    })


module.exports = router