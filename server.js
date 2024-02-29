const express =  require("express");
const cors = require('cors');
const app = express()
const workoutRouter = require("./routes/workout.js")
const exerciseRouter = require("./routes/exercise.js")
const logger = require("./common/logging.js")

app.use(logger)
app.use(cors())
app.use(express.json())

app.use("/workout", workoutRouter)
app.use("/exercise", exerciseRouter)

app.listen(3030)