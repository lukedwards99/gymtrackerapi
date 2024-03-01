const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function getWorkouts() {
    return await runQuery("SELECT * FROM workout;")
}

async function getWorkout(id) {
    const data = await runQuery(CONSTANTS.getWorkout_sql, [id])
    return reduceWorkouts(data)
}

async function getWorkoutTypes(id) {
    return await runQuery(CONSTANTS.getWorkoutTypes_sql)
}

async function putWorkoutType(name){
    return await runQuery(CONSTANTS.insertWorkoutType_sql, [name])
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
    return await runQuery(CONSTANTS.deleteWorkoutType_sql, [uid])
}

module.exports = { getWorkouts, getWorkout, insertWorkout, getWorkoutTypes, putWorkoutType, deleteWorkoutType };