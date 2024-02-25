const runQuery = require("./dbconnect")

async function getWorkouts() {
    return await runQuery("SELECT * FROM workout;")
}

async function getWorkout(id){
    const sql = `
        SELECT
            W.UID AS WorkoutID,
            W.WORKOUT_TIME,
            WES.EXERCISE_NAME,
            WES.REPS,
            WES.DIFFICULTY_SCORE,
            WES.PERCEIVED_STIMULATION_SCORE,
            E.EXERCISE_TYPE_ID,
            E.MANUFACTURER,
            E.COMMENTS
        FROM
            WORKOUT W
        JOIN WORKOUTEXERCISESELECTION WES ON W.UID = WES.WORKOUT_ID
        JOIN EXERCISE E ON WES.EXERCISE_NAME = E.EXERCISE_NAME
        WHERE
            W.UID = $1;
    `
    return await runQuery(sql, [id])
}

module.exports = {getWorkouts, getWorkout};