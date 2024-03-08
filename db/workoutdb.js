const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function getWorkouts() {
    return await runQuery("SELECT * FROM workout;")
}

async function getWorkout(id) {
    const data = await runQuery(CONSTANTS.getWorkout_sql, [id])
    return reduceWorkouts(data)
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

function reduceWorkouts(data){
    if(data == null || data.length === 0){
        return {}
    }

    let workout = {
        id: data[0].workoutid,
        time: data[0].workout_time,
        title: data[0].workout_title,
        dayName: data[0].day_name,
        exercises: []
    }

    for (let i = 0; i < data.length; i++) {
        const exercise = data[i];
        workout.exercises.push({
            name: exercise.category_name,
            manufacturer: exercise.manufacturer,
            reps: exercise.reps,
            difficultyScore: exercise.difficulty_score,
            simulationScore: exercise.perceived_stimulation_score,
            comments: exercise.comments,
            uid: exercise.uid
        })
    }
    return workout
}

async function insertWorkout(time, title, typeId){
    return await runQuery(CONSTANTS.insertWorkout_sql, [time, title, typeId])
}

async function deleteWorkoutType(uid){
    return await runQuery(CONSTANTS.logicalDeleteWorkoutType_sql, [uid])
}

async function deleteWorkout(uid){
    return await runQuery(CONSTANTS.deleteWorkout_sql, [uid])
}

module.exports = { getWorkouts, getWorkout, insertWorkout, getWorkoutTypes, putWorkoutType, deleteWorkoutType, deleteWorkout, getWorkoutTypesActive };