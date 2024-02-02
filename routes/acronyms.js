
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
router.get("/pg/:id", (request, response) => {
    const id = request.params.id;
    console.log(id);

    db.client.connect(async (err) => {
        if (err) {
            console.log("We have an error", err);
        } else {
            const queryConfig = {
                text: "SELECT * FROM fuqua_acronyms WHERE id = $1",
                values: [id]
            };
            const result = await db.pool.query(queryConfig);
            console.log("result!", result.rows[0]);
            response.send(result.rows);
        }
    });
});



// Define route to test postgres connectivity
// http://localhost:3050/acronyms/pg
router.get("/pg", async (request, response) => {
    db.client.connect(async (err) => {
        if (err) {
            console.log("We have an error", err);
        } else {
            const result = await db.pool.query("SELECT * FROM fuqua_acronyms");
            console.log("result!", result.rows[0]);
            response.send(result.rows);
        }
    });
});

module.exports = router;