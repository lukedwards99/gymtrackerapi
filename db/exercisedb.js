const runQuery = require("./dbconnect")
const {CONSTANTS} = require("../common/constants")

async function getExerciseCategory(){
    return await runQuery(CONSTANTS.getExerciseCategory_sql)
}

async function putExerciseCategory(name){
    if (name.trim().length === 0){
        return {success: false, message: "Name cannot be empty"}
    }
    console.log("adding category type: " + name)
    const workoutTypes = await getExerciseCategory()
    for(const type of workoutTypes){
        if(type.category_name === name){
            if(type.logical_delete == true){
                const success = runQuery(CONSTANTS.logicalUnDeleteExerciseCategory_sql, [type.uid])
                return {success: success ? true : false, message: "Logical insert"}
            }
            return {success: false, message: "This category already exists"}
        }    
    }
    const success = await runQuery(CONSTANTS.putExerciseCategory_sql, [name])
    return {success: success ? true : false}
}

async function deleteExerciseCategory(id){
    return await runQuery(CONSTANTS.logicalDeleteExerciseCategory_sql, [id])
}

async function getExerciseCategoryActive(){
    return await runQuery(CONSTANTS.getExerciseCategoryActive_sql)
}


module.exports = { getExerciseCategory, putExerciseCategory, deleteExerciseCategory, getExerciseCategoryActive };