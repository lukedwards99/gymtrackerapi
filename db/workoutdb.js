const pool = require("./dbconnect")

// (async () => {
//     try {
//         const response = await pool.query("SELECT current_user");    
//         const {rows} = response;
//         const currentUser = rows[0]['current_user'];
//         console.log(currentUser);  // postgres
//     } catch (err) {
//         console.log(err);
//     }
// })();

async function getWorkouts() {
    try {
        const response = await pool.query("SELECT current_user");
        const { rows } = response;
        const currentUser = rows[0]['current_user'];
        console.log(currentUser);  
    } catch (err) {
        console.log(err);
    }

    // need to return workouts

}

module.exports.getWorkouts = getWorkouts;