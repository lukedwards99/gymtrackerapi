module.exports.CONSTANTS = {
    getWorkout_sql:
        `SELECT
            W.UID AS WorkoutID,
            W.WORKOUT_TIME,
            W.WORKOUT_TITLE,
            WT.DAY_NAME,
            EC.CATEGORY_NAME,
            WES.UID,
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
        `SELECT uid, day_name, logical_delete FROM workouttype;`,

    getWorkoutTypesActive_sql:
        `SELECT uid, day_name FROM workouttype WHERE logical_delete = false;`,
    
    insertWorkoutType_sql: 
        `INSERT INTO WORKOUTTYPE (DAY_NAME) VALUES ($1);`,

    insertExercise_sql:
        `INSERT INTO WORKOUTEXERCISESELECTION (WORKOUT_ID, EXERCISE_NAME_ID, REPS, DIFFICULTY_SCORE, PERCEIVED_STIMULATION_SCORE) VALUES ($1, $2, $3,$4, $5);`,

    removeWorkoutExercise_sql:
        `DELETE FROM WORKOUTEXERCISESELECTION WHERE UID = $1`,

    getExerciseCategory_sql:
        `SELECT * FROM exercisecategory`,

    putExerciseCategory_sql:
        `INSERT INTO EXERCISECATEGORY (CATEGORY_NAME) VALUES ($1);`,

    deleteExerciseCategory_sql:
        `DELETE FROM EXERCISECATEGORY WHERE UID = $1;`,

    logicalDeleteWorkoutType_sql:
        `UPDATE workouttype SET logical_delete = true where uid = $1`,

    logicalUnDeleteWorkoutType_sql:
        `UPDATE workouttype SET logical_delete = false where uid = $1`,

    deleteWorkout_sql:
        `DELETE FROM WORKOUT WHERE UID = $1;`
}