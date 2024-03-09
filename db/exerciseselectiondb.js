const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function insertExercises(workoutID, exerciseNameID, reps, difficulty, stimulation, order){
    debugger
    return await runQuery(CONSTANTS.insertExercise_sql, [workoutID, exerciseNameID, reps, difficulty, stimulation, order])
}

async function removeExercise(workoutExerciseID){
    return await runQuery(CONSTANTS.removeWorkoutExercise_sql, [workoutExerciseID])
}

async function getExercisesForWorkout(workoutID){
    const exercises = 
        await runQuery(`SELECT W.uid as workout_id, WES.uid as workout_selection_id, 
            WES.exercise_name_id AS category_id, 
            WES.workout_order AS order,
            EC.category_name, WES.reps,
            WES.difficulty_score, WES.perceived_stimulation_score
            FROM workout W
            JOIN workoutexerciseselection WES on WES.workout_id = W.uid
            JOIN exercisecategory EC on EC.uid = WES.exercise_name_id
            WHERE W.uid = $1;`, [workoutID])

    return exercises
}

async function getExerciseByExerciseSelectionID(exercise_selection_id){
    return await runQuery(`SELECT * FROM public.workoutexerciseselection WHERE uid = $1`, [exercise_selection_id])
}

async function getExercisesForWorkoutForExerciseSelectionID(exercise_selection_id){
    const singleExercise = await getExerciseByExerciseSelectionID(exercise_selection_id)

    if(singleExercise == null || singleExercise.length == 1){
        return {error: true, message: "invalid exercise_selection_id: " + exercise_selection_id }
    }

    const exercises = 
        await runQuery(`SELECT W.uid as workout_id, WES.uid as workout_selection_id, 
            WES.exercise_name_id AS category_id, 
            WES.workout_order AS order,
            EC.category_name, WES.reps,
            WES.difficulty_score, WES.perceived_stimulation_score
            FROM workout W
            JOIN workoutexerciseselection WES on WES.workout_id = W.uid
            JOIN exercisecategory EC on EC.uid = WES.exercise_name_id
            WHERE W.uid = $1;`, [singleExercise[0].workout_id])

    console.log("exercises: " + JSON.stringify(exercises))
    return exercises
}

async function moveExerciseUp(exercise_id){
    const orderResult =  orderExercises(exercise_id)
    if(orderResult.error){
        return exercise_selection_id
    }
}

async function moveExerciseDown(exercise_id){
    orderExercises(exercise_id)
}

async function orderExercises(exercise_id){
    let exercises = await getExercisesForWorkoutForExerciseSelectionID(exercise_id)

    if(exercises.error){
        return exercises
    }
    console.log("exercises 2: " + JSON.stringify(exercises))
    exercises.sort((a, b) => a.workout_order - b.workout_order)
    
    for(let i = 0; i < exercises.length; i++){
        console.log(JSON.stringify(exercises[i]))
    }

}

module.exports = { insertExercises, removeExercise, getExercisesForWorkout, moveExerciseUp, moveExerciseDown };