const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function insertExercises(workoutID, exerciseNameID, reps, difficulty, stimulation){
    return await runQuery(CONSTANTS.insertExercise_sql, [workoutID, exerciseNameID, reps, difficulty, stimulation])
}

async function removeExercise(workoutExerciseID){
    return await runQuery(CONSTANTS.removeWorkoutExercise_sql, [workoutExerciseID])
}


module.exports = { insertExercises, removeExercise };