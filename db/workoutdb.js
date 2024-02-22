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
        const response = await pool.query("SELECT * FROM workout;");
        const { rows } = response;
        return rows
    } catch (err) {
        console.log(err);
        return false
    }
}

module.exports.getWorkouts = getWorkouts;