const runQuery = require("./dbconnect")

async function getWorkouts() {
    return await runQuery("SELECT * FROM workout;")
}

async function getWorkout(id) {
    const sql = `
    SELECT
        W.UID AS WorkoutID,
        W.WORKOUT_TIME,
        W.WORKOUT_TITLE,
        WT.DAY_NAME,
        EC.CATEGORY_NAME,
        WES.REPS,
        WES.DIFFICULTY_SCORE,
        WES.PERCEIVED_STIMULATION_SCORE,
        E.MANUFACTURER,
        E.COMMENTS
    FROM
        WORKOUT W
    JOIN WORKOUTEXERCISESELECTION WES ON W.UID = WES.WORKOUT_ID
    JOIN EXERCISE E ON WES.EXERCISE_NAME_ID = E.UID
    JOIN WORKOUTTYPE WT ON W.WORKOUTTYPE_ID = WT.UID
    JOIN EXERCISECATEGORY EC ON WES.EXERCISE_NAME_ID = EC.UID
    WHERE
        W.UID = $1;
    `

    const data = await runQuery(sql, [id])
    return reduceWorkouts(data)
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
            simulationScore: exercise.perceived_simulation_score,
            comments: exercise.comments
        })
    }
    return workout
}

module.exports = { getWorkouts, getWorkout };