const express =  require("express");
const cors = require('cors');
const app = express()
const workoutRouter = require("./routes/workout.js")

app.use(cors());

app.get("/", (req, res) => {
    console.log("hello world")
    res.send("hello world")
})
app.use("/workout", workoutRouter)

app.listen(3030)