module.exports.CONSTANTS = {
    getWorkout_sql:
        `SELECT
            w.uid as workout_id,
            w.workout_time,
            w.workout_title,
            w.day_number,
            wt.uid as workout_type_id,
            wt.day_name,
            wt.logical_delete as workout_type_deleted 	
        FROM
            WORKOUT W
        JOIN WORKOUTTYPE WT ON W.WORKOUTTYPE_ID = WT.UID
        WHERE
            W.UID = $1;`,
    getWorkoutandExercise_sql:
        `SELECT
            W.UID AS WorkoutID,
            W.WORKOUT_TIME,
            W.WORKOUT_TITLE,
            w.day_number,
            WT.DAY_NAME,
            EC.CATEGORY_NAME,
            WES.UID,
            WES.REPS,
            WES.DIFFICULTY_SCORE,
            WES.PERCEIVED_STIMULATION_SCORE,
            WES.workout_order,
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
        `INSERT INTO WORKOUT (WORKOUT_TIME, WORKOUT_TITLE, WORKOUTTYPE_ID, day_number) VALUES ($1, $2, $3, $4);`,
    
    getWorkoutTypes_sql:
        `SELECT uid, day_name, logical_delete FROM workouttype;`,

    getWorkoutTypesActive_sql:
        `SELECT uid, day_name FROM workouttype WHERE logical_delete = false;`,
    
    insertWorkoutType_sql: 
        `INSERT INTO WORKOUTTYPE (DAY_NAME) VALUES ($1);`,

    insertExercise_sql:
        `INSERT INTO WORKOUTEXERCISESELECTION (WORKOUT_ID, EXERCISE_NAME_ID, REPS, DIFFICULTY_SCORE, PERCEIVED_STIMULATION_SCORE, workout_order) VALUES ($1, $2, $3,$4, $5, $6);`,

    removeWorkoutExercise_sql:
        `DELETE FROM WORKOUTEXERCISESELECTION WHERE UID = $1`,

    getExerciseCategory_sql:
        `SELECT * FROM exercisecategory`,
    
    getExerciseCategoryActive_sql:
        `SELECT uid, category_name FROM exercisecategory where logical_delete = false`,

    putExerciseCategory_sql:
        `INSERT INTO EXERCISECATEGORY (CATEGORY_NAME) VALUES ($1);`,

    deleteExerciseCategory_sql:
        `DELETE FROM EXERCISECATEGORY WHERE UID = $1;`,

    logicalDeleteWorkoutType_sql:
        `UPDATE workouttype SET logical_delete = true where uid = $1`,

    logicalUnDeleteWorkoutType_sql:
        `UPDATE workouttype SET logical_delete = false where uid = $1`,

    logicalUnDeleteExerciseCategory_sql:
        `UPDATE EXERCISECATEGORY SET logical_delete = false where uid = $1`,

    logicalDeleteExerciseCategory_sql:
        `UPDATE EXERCISECATEGORY SET logical_delete = true where uid = $1`,

    deleteWorkout_sql:
        `DELETE FROM WORKOUT WHERE UID = $1;`
}