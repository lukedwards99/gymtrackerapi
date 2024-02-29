module.exports.CONSTANTS = {
    getWorkout_sql:
        `SELECT
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
            W.UID = $1;`,

    insertWorkout_sql:
        `INSERT INTO WORKOUT (WORKOUT_TIME, WORKOUT_TITLE, WORKOUTTYPE_ID) VALUES ($1, $2, $3);`,
    
    getWorkoutTypes_sql:
        `SELECT uid, day_name FROM workouttype;`,
    
    insertWorkoutType_sql: 
        `INSERT INTO WORKOUTTYPE (DAY_NAME) VALUES ($1);`,
}