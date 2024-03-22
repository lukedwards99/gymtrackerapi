const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function insertSet(exercise_selection_id, reps, difficulty_score, perceived_stimulation_score){
    
    const orderSetsResult = await orderSets(exercise_selection_id)

    if (orderSetsResult.success == false){
        return orderSetsResult
    }
    console.log(JSON.stringify(orderSetsResult))

    let index_order =  orderSetsResult.sets.length //set new index order to length so it is indexed correctly

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
    
    if(!sets){
        return {success: false, message: "could not run exerciseset query"}
    }

    return {success: true, sets: sets}
}

async function orderSetsBySetId(set_id){

    const results = await runQuery(`SELECT * FROM exerciseset WHERE uid = $1`, [set_id])

    if (!results || results.length === 0){
        return {success: false, message: "could not find set id"}
    }

    const exercise_selection_id = results[0].workout_exercise_id

    return await orderSets(exercise_selection_id)
}


async function orderSets(exercise_selection_id){
    const getSetsResult = await getSetsForExercise(exercise_selection_id)
    console.log(JSON.stringify(getSetsResult))

    if (getSetsResult.success == false){
        return getSetsResult
    }

    if(getSetsResult.error){
        return sets //return  error object if needed
    }

    let sets = getSetsResult.sets
    if (sets.length == 0){
        console.log("no sets to order")
        return {success: true, sets: []}
    }

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

async function moveSetUp(set_id){
    //always make sure that our sets are in order before changing 
    const data =  await orderSetsBySetId(set_id)
    if(data.success !== true){
        console.log("return move exercise up fail")
        return data //return error object if there was some failure
    }

    console.log("length: " + data.sets.length)

    for(let i = 0; i < data.sets.length; i++){
        const set = data.sets[i]
        console.log(JSON.stringify(set))
        if (set.uid == set_id){
            console.log("found match")
            if (i === 0) {
                return {success: true, message:"already first exercise"}
            }
            //switch entries
            //first move entry up
            let success = await runQuery("UPDATE exerciseset SET index_order = $1 where uid = $2;", [i - 1, set.uid])
            if (!success){
                return {success: false, message: "cant update exercise selection: " + set.uid}
            }
            //move second entry down
            success = await runQuery("UPDATE exerciseset SET index_order = $1 where uid = $2;", [i, data.sets[i - 1].uid])
            if (!success){
                return {success: false, message: "cant update exercise selection: " + set.uid}
            }
            return {success: true}
        }
    }
    
    return {success: false, message: "invalid set id"}
}

async function moveSetDown(set_id){
    const data =  await orderSetsBySetId(set_id)
    if(data.success !== true){
        console.log("return move exercise up fail")
        return data //return error object if there was some failure
    }

    console.log("length: " + data.sets.length)

    for(let i = 0; i < data.sets.length - 1; i++){
        const set = data.sets[i]
        if (set.uid == set_id){
            let success = await runQuery("UPDATE exerciseset SET index_order = $1 where uid = $2;", [i + 1, set.uid])
            if (!success){
                return {success: false, message: "cant update exercise selection: " + set.uid}
            }
            //move second entry up
            success = await runQuery("UPDATE exerciseset SET index_order = $1 where uid = $2;", [i, data.sets[i + 1].uid])
            if (!success){
                return {success: false, message: "cant update exercise selection: " + set.uid}
            }
            return {success: true}
        }
    }
    return {success: true, message:"already last set"}
   
    // return {success: false, message: "invalid exercise id"}
}

module.exports = { insertSet, getSetsForExercise, deleteSet, moveSetUp, moveSetDown};

