const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function insertExercises(workoutID, exerciseNameID, reps, difficulty, stimulation){
    return await runQuery(CONSTANTS.insertExercise_sql, [workoutID, exerciseNameID, reps, difficulty, stimulation])
}

async function removeExercise(workoutExerciseID){
    return await runQuery(CONSTANTS.removeWorkoutExercise_sql, [workoutExerciseID])
}

async function getExercisesForWorkout(workoutID){
    const exercises = 
        runQuery(`SELECT W.uid as workout_id, WES.uid as workout_selection_id, 
            WES.exercise_name_id AS category_id, 
            EC.category_name, WES.reps,
            WES.difficulty_score, WES.perceived_stimulation_score
            FROM workout W
            JOIN workoutexerciseselection WES on WES.workout_id = W.uid
            JOIN exercisecategory EC on EC.uid = WES.exercise_name_id
            WHERE W.uid = $1;`, [workoutID])

    return exercises
}

module.exports = { insertExercises, removeExercise, getExercisesForWorkout };