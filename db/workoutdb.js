const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function getWorkouts() {
    return await runQuery("SELECT * FROM workout;")
}

async function getWorkout(id) {
    const excerciseData = await runQuery(CONSTANTS.getWorkoutandExercise_sql, [id])
    const workoutData = await runQuery(CONSTANTS.getWorkout_sql, [id])
    return reduceWorkouts(excerciseData, workoutData)
}

async function getWorkoutTypes() {
    return await runQuery(CONSTANTS.getWorkoutTypes_sql)
}

async function getWorkoutTypesActive(id) {
    return await runQuery(CONSTANTS.getWorkoutTypesActive_sql)
}

async function putWorkoutType(name){
    if (name.trim().length === 0){
        return {success: false, message: "Name cannot be empty"}
    }
    console.log("adding workout day: " + name)
    const workoutTypes = await getWorkoutTypes()
    for(const type of workoutTypes){
        if(type.day_name === name){
            if(type.logical_delete == true){
                const success = runQuery(CONSTANTS.logicalUnDeleteWorkoutType_sql, [type.uid])
                return {success: success ? true : false, message: "Logical insert"}
            }
            return {success: false, message: "This type already exists"}
        }    
    }
    const success = await runQuery(CONSTANTS.insertWorkoutType_sql, [name])
    return {success: success ? true : false}
}

function reduceWorkouts(exerciseData, workoutData){
    if(workoutData === null || workoutData.length === 0){
        return {success: false, msg: "No workout found"}
    }

    let workout = {
        id: workoutData[0].workout_id,
        time: workoutData[0].workout_time,
        title: workoutData[0].workout_title,
        dayName: workoutData[0].day_name,
        dayNameID: workoutData[0].workout_type_id,
        dayNumber: workoutData[0].day_number,
        exercises: []
    }

    for (let i = 0; i < exerciseData.length; i++) {
        const exercise = exerciseData[i];
        workout.exercises.push({
            name: exercise.category_name,
            manufacturer: exercise.manufacturer,
            reps: exercise.reps,
            difficultyScore: exercise.difficulty_score,
            simulationScore: exercise.perceived_stimulation_score,
            order: exercise.workout_order,
            comments: exercise.comments,
            uid: exercise.uid
        })
    }
    return workout
}

async function insertWorkout(time, title, typeId, dayNumber){
    if (time === null || time.trim() == ""){
        time = (new Date(Date.now())).toISOString()
    }
    if(typeof dayNumber != "number"){
        dayNumber = 0
    }
    return await runQuery(CONSTANTS.insertWorkout_sql, [time, title, typeId, dayNumber])
}

async function deleteWorkoutType(uid){
    return await runQuery(CONSTANTS.logicalDeleteWorkoutType_sql, [uid])
}

async function deleteWorkout(uid){
    return await runQuery(CONSTANTS.deleteWorkout_sql, [uid])
}

async function patchWorkout(uid, time, title, typeId, dayNumber){
    if (time.trim() == ""){
        time = null
    }
    if(dayNumber == null){
        dayNumber = 0
    }
    const success = await runQuery(`UPDATE workout SET workout_title = $1, workout_time = $2, workouttype_id = $3, day_number = $4 WHERE uid = $5;`, [title, time, typeId, dayNumber, uid])
    if(!success){
        console.error("Error updating workout with id: " + uid)
        return {success: false, message: "Unable to update"}
    }
    return {success: true}
}

module.exports = { getWorkouts, getWorkout, insertWorkout, getWorkoutTypes, putWorkoutType, deleteWorkoutType, deleteWorkout, getWorkoutTypesActive, patchWorkout };