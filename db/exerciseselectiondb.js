const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")
const {orderTable} = require("../common/util")

async function insertExercises(workoutID, exerciseNameID, order){
    debugger
    return await runQuery(CONSTANTS.insertExercise_sql, [workoutID, exerciseNameID, order])
}

async function removeExercise(workoutExerciseID){
    return await runQuery(CONSTANTS.removeWorkoutExercise_sql, [workoutExerciseID])
}

async function getExercisesForWorkout(workoutID){
    const exercises = 
        await runQuery(`SELECT W.uid as workout_id, WES.uid as workout_selection_id, 
            WES.exercise_name_id AS category_id, 
            WES.index_order AS order,
            EC.category_name
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
    // console.log("workout id: " + JSON.stringify(singleExercise))
    // console.log("workout id: " + singleExercise[0].workout_id)

    if(singleExercise == null || singleExercise.length == 0){
        return {error: true, message: "invalid exercise_selection_id: " + exercise_selection_id }
    }

    const exercises = 
        await runQuery(`SELECT W.uid as workout_id, WES.uid as workout_selection_id, 
            WES.exercise_name_id AS category_id, 
            WES.index_order AS order,
            EC.category_name
            FROM workout W
            JOIN workoutexerciseselection WES on WES.workout_id = W.uid
            JOIN exercisecategory EC on EC.uid = WES.exercise_name_id
            WHERE W.uid = $1;`, [singleExercise[0].workout_id])

    // console.log("exercises: " + JSON.stringify(exercises))
    return exercises
}

async function moveExerciseUp(exercise_selection_id){
    console.log(exercise_selection_id)
    //always make sure that our exercises are in order before changing 
    const data =  await orderExercises(exercise_selection_id)
    if(data.success !== true){
        console.log("return move exercise up fail")
        return data //return error object if there was some failure
    }

    console.log("length: " + data.exercises.length)

    for(let i = 0; i < data.exercises.length; i++){
        const exercise = data.exercises[i]
        console.log(JSON.stringify(exercise))
        if (exercise.workout_selection_id == exercise_selection_id){
            console.log("found match")
            if (i === 0) {
                return {success: true, message:"already first exercise"}
            }
            //switch entries
            //first move entry up
            let success = await runQuery("UPDATE workoutexerciseselection SET index_order = $1 where uid = $2;", [i - 1, exercise.workout_selection_id])
            if (!success){
                return {success: false, message: "cant update exercise selection: " + exercise.workout_selection_id}
            }
            //move second entry down
            success = await runQuery("UPDATE workoutexerciseselection SET index_order = $1 where uid = $2;", [i, data.exercises[i - 1].workout_selection_id])
            if (!success){
                return {success: false, message: "cant update exercise selection: " + exercise.workout_selection_id}
            }
            return {success: true}
        }
    }
    
    return {success: false, message: "invalid exercise id"}
}

async function moveExerciseDown(exercise_id){
    const data =  await orderExercises(exercise_id)
    if(data.success !== true){
        console.log("return move exercise down fail")
        return data //return error object if there was some failure
    }

    for(let i = 0; i < data.exercises.length - 1; i++){
        const exercise = data.exercises[i]
        if (exercise.workout_selection_id == exercise_id){
            // if (exercise.index_order === data.exercises.length - 1) {
            //     return {success: true, message:"already last exercise"}
            // }
            //switch entries
            //first move entry down
            let success = await runQuery("UPDATE workoutexerciseselection SET index_order = $1 where uid = $2;", [i + 1, exercise.workout_selection_id])
            if (!success){
                return {success: false, message: "cant update exercise selection: " + exercise.workout_selection_id}
            }
            //move second entry up
            success = await runQuery("UPDATE workoutexerciseselection SET index_order = $1 where uid = $2;", [i, data.exercises[i + 1].workout_selection_id])
            if (!success){
                return {success: false, message: "cant update exercise selection: " + exercise.workout_selection_id}
            }
            return {success: true}
        }
    }
    return {success: true, message:"already last exercise"}
   
    // return {success: false, message: "invalid exercise id"}
}

async function orderExercises(exercise_id){
    let exercises = await getExercisesForWorkoutForExerciseSelectionID(exercise_id)

    if (exercises == false){
        return {success: false, message: "invalid exercise selection id"}
    }

    if(exercises.error){
        return exercises //return  error object if needed
    }
    // console.log("exercises: " + JSON.stringify(exercises))
    exercises.sort((a, b) => a.order - b.order)
    
    for(let i = 0; i < exercises.length; i++){
        if (exercises[i].order !== i ){
            const success = await runQuery("UPDATE workoutexerciseselection SET INDEX_order = $1 where uid = $2;", [i, exercises[i].workout_selection_id])
            if(!success){
                console.log("Error running ordering query")
                return {success: false, message: "Order Update query failed"}
            }
            exercises[i].order = i 
        }
    }
    // const orderResult = await orderTable(exercises, 'workoutexerciseselection', runQuery)
    // if (!orderResult.success){
    //     return orderResult;
    // }
    // return {success: orderResult.success, exercises: orderResult.array}
    return {success: true, exercises: exercises}
}

module.exports = { insertExercises, removeExercise, getExercisesForWorkout, moveExerciseUp, moveExerciseDown };