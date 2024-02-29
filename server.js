const express =  require("express");
const cors = require('cors');
const app = express()
const workoutRouter = require("./routes/workout.js")

app.use(cors())
app.use(express.json())

app.use("/workout", workoutRouter)

app.listen(3030)