const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function insertSet(exercise_selection_id, reps, difficulty_score, perceived_stimulation_score){
    
    const orderSetsResult = await orderSets(exercise_selection_id)

    if (orderSetsResult.success == false){
        return orderSetsResult
    }
    console.log(JSON.stringify(orderSetsResult))

    const index_order = orderSetsResult.sets[orderSetsResult.sets.length - 1].index_order + 1

    console.log("index order " + index_order)

    const result = await runQuery(`INSERT INTO exerciseset (workout_exercise_id, reps, difficulty_score, perceived_stimulation_score, index_order) values ($1,$2,$3,$4,$5)`, 
        [exercise_selection_id, reps, difficulty_score, perceived_stimulation_score, index_order])
    
    if (result === false){
        return {success: false, message: "Unable to insert"}
    }

    return {success: true}
}

async function getSetsForExercise(exercise_selection_id){
    const sets = 
        await runQuery(`SELECT uid, workout_exercise_id, reps, difficulty_score, perceived_stimulation_score, index_order
        FROM exerciseset WHERE workout_exercise_id = $1`, [exercise_selection_id])

    return {success: true, sets: sets}
}


async function orderSets(exercise_selection_id){
    const getSetsResult = await getSetsForExercise(exercise_selection_id)

    if (getSetsResult.success == false){
        return {sets}
    }

    if(getSetsResult.error){
        return sets //return  error object if needed
    }

    let sets = getSetsResult.sets

    console.log("sets: " + JSON.stringify(sets))
    sets.sort((a, b) => a.index_order - b.index_order)
    
    for(let i = 0; i < sets.length; i++){
        if (sets[i].index_order !== i ){
            const success = await runQuery("UPDATE exerciseset SET INDEX_order = $1 where uid = $2;", [i, sets[i].uid])
            if(!success){
                console.log("Error running ordering set query")
                return {success: false, message: "Order Update query failed"}
            }
            sets[i].index_order = i 
        }
    }

    return {success: true, sets: sets}
}

async function deleteSet(set_id){

    const success = runQuery(`DELETE FROM exerciseset WHERE uid = $1`, [set_id])

    if(!success){
        return {success: false, message: "Couldnt delete"}
    }

    return {success: true}

}

module.exports = { insertSet, getSetsForExercise, deleteSet };


// async function getExerciseByExerciseSelectionID(exercise_selection_id){
//     return await runQuery(`SELECT * FROM public.workoutexerciseselection WHERE uid = $1`, [exercise_selection_id])
// }

// async function moveExerciseUp(exercise_selection_id){
//     console.log(exercise_selection_id)
//     //always make sure that our exercises are in order before changing 
//     const data =  await orderExercises(exercise_selection_id)
//     if(data.success !== true){
//         console.log("return move exercise up fail")
//         return data //return error object if there was some failure
//     }

//     console.log("length: " + data.exercises.length)

//     for(let i = 0; i < data.exercises.length; i++){
//         const exercise = data.exercises[i]
//         console.log(JSON.stringify(exercise))
//         if (exercise.workout_selection_id == exercise_selection_id){
//             console.log("found match")
//             if (i === 0) {
//                 return {success: true, message:"already first exercise"}
//             }
//             //switch entries
//             //first move entry up
//             let success = await runQuery("UPDATE workoutexerciseselection SET index_order = $1 where uid = $2;", [i - 1, exercise.workout_selection_id])
//             if (!success){
//                 return {success: false, message: "cant update exercise selection: " + exercise.workout_selection_id}
//             }
//             //move second entry down
//             success = await runQuery("UPDATE workoutexerciseselection SET index_order = $1 where uid = $2;", [i, data.exercises[i - 1].workout_selection_id])
//             if (!success){
//                 return {success: false, message: "cant update exercise selection: " + exercise.workout_selection_id}
//             }
//             return {success: true}
//         }
//     }
    
//     return {success: false, message: "invalid exercise id"}
// }

// async function moveExerciseDown(exercise_id){
//     const data =  await orderExercises(exercise_id)
//     if(data.success !== true){
//         console.log("return move exercise down fail")
//         return data //return error object if there was some failure
//     }

//     for(let i = 0; i < data.exercises.length - 1; i++){
//         const exercise = data.exercises[i]
//         if (exercise.workout_selection_id == exercise_id){
//             // if (exercise.index_order === data.exercises.length - 1) {
//             //     return {success: true, message:"already last exercise"}
//             // }
//             //switch entries
//             //first move entry down
//             let success = await runQuery("UPDATE workoutexerciseselection SET index_order = $1 where uid = $2;", [i + 1, exercise.workout_selection_id])
//             if (!success){
//                 return {success: false, message: "cant update exercise selection: " + exercise.workout_selection_id}
//             }
//             //move second entry up
//             success = await runQuery("UPDATE workoutexerciseselection SET index_order = $1 where uid = $2;", [i, data.exercises[i + 1].workout_selection_id])
//             if (!success){
//                 return {success: false, message: "cant update exercise selection: " + exercise.workout_selection_id}
//             }
//             return {success: true}
//         }
//     }
//     return {success: true, message:"already last exercise"}
   
//     // return {success: false, message: "invalid exercise id"}
// }