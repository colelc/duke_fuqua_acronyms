
const express = require("express");
const router = express.Router();
const db = require("../db/postgres");

// Define route for get all acronyms
// http://localhost:3050/acronyms
// router.get("/", (request, response) => {
//     response.send("This is the get all acronyms route");
// });



// Define route for get a specific acronym by id
// http://localhost:3050/acronyms/71
// router.get("/acronyms/:id", (request, response) => {
//     const id = request.params.id;
//     console.log(id);

//     db.pool.connect(async (err) => {
//         if (err) {
//             console.log("We have an error", err);
//         } else {
//             const queryConfig = {
//                 text: "SELECT * FROM fuqua_acronyms WHERE id = $1",
//                 values: [id]
//             };
//             const result = await db.client.query(queryConfig);
//             console.log("result!", result.rows[0]);
//             //response.send(result.rows);
//             response.status(200).json(result.rows);
//         }
//     });
// });
try {
    router.get("/acronyms/:id", async (request, response) => {
        const id = request.params.id;
        console.log(id);

        const queryConfig = {
            text: "SELECT * FROM fuqua_acronyms WHERE id = $1",
            values: [id]
        };

        const pgClient = await db.pool.connect();
        const result = await pgClient.query(queryConfig);
        pgClient.release();
        console.log("result!", result.rows[0]);
        //response.send(result.rows);
        response.status(200).json(result.rows);
    });   
} catch(err) {
    return result.send("There was an error");
}


// Define route to test postgres connectivity
// http://localhost:3050/api/acronyms
try {
    router.get("/acronyms", async (request, response, next) => {
        const pgClient = await db.pool.connect();
        const result = await pgClient.query("SELECT * FROM fuqua_acronyms");
        pgClient.release();
        console.log("result!", result.rows[0]);
        //response.send(result.rows);
        response.json(result.rows);
    });
} catch(err) {
    return result.send("There was an error", err);
}

module.exports = router;