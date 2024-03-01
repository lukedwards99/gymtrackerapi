const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function insertExercises(workoutID, exerciseNameID, reps, difficulty, stimulation){
    return await runQuery(CONSTANTS.insertExercise_sql, [workoutID, exerciseNameID, reps, difficulty, stimulation])
}

async function removeExercise(workoutExerciseID){
    return await runQuery(CONSTANTS.removeWorkoutExercise_sql, [workoutExerciseID])
}

async function getExerciseCategory(){
    return await runQuery(CONSTANTS.getExerciseCategory_sql)
}

async function putExerciseCategory(name){
    return await runQuery(CONSTANTS.putExerciseCategory_sql, [name])
}

async function deleteExerciseCategory(id){
    return await runQuery(CONSTANTS.deleteExerciseCategory_sql, [id])
}


module.exports = { insertExercises, removeExercise, getExerciseCategory, putExerciseCategory, deleteExerciseCategory };