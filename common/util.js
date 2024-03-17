// async function orderTable(array, table_name, runQuery){
//     array.sort((a, b) => a.index_order - b.index_order)
    
//     for(let i = 0; i < array.length; i++){
//         if (array[i].index_order !== i ){
//             const success = await runQuery(`UPDATE ${table_name} SET index_order = $1 where uid = $2;`, [i, array[i].workout_selection_id])
//             if(!success){
//                 console.error("Error running ordering query")
//                 return {success: false, message: "Order Update query failed"}
//             }
//             array[i].index_order = i 
//         }
//     }

//     return {success: true, array: array}
// }

// module.exports = {orderTable}