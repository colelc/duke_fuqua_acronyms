
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

// http://localhost:3050/api/acronyms
try {
    router.get("/acronyms", async (request, response, next) => {
        const pgClient = await db.pool.connect();

        // let sql = "SELECT t.name, a.* FROM fuqua_acronyms a, fuqua_acronym_tags t ";
        // sql += " LEFT JOIN fuqua_acronym_tag_map m on m.tag_id = t.id ";
        // sql += " WHERE m.acronym_id = a.id ";
        // sql += " ORDER BY a.id, t.name";
        // const result = await pgClient.query(sql);

        const result = await pgClient.query("SELECT * FROM fuqua_acronyms");
        pgClient.release();
        response.json(result.rows);
    });
} catch(err) {
    return result.send("There was an error", err);
}

// http://localhost:3050/api/acronym_tags
try {
    router.get("/acronym_tags", async (request, response, next) => {
        const pgClient = await db.pool.connect();

        const result = await pgClient.query("SELECT * FROM fuqua_acronym_tags");
        pgClient.release();
        response.json(result.rows);
    });
} catch(err) {
    return result.send("There was an error", err);
}

// http://localhost:3050/api/acronym_tag_map
try {
    router.get("/acronym_tag_map", async (request, response, next) => {
        const pgClient = await db.pool.connect();

        const result = await pgClient.query("SELECT * FROM fuqua_acronym_tag_map");
        pgClient.release();
        response.json(result.rows);
    });
} catch(err) {
    return result.send("There was an error", err);
}

// POST NEW ACRONYM
try {
    router.post("/new_acronym", (request, response) => {
        console.log("router.post");
       // console.log("request", request);
       console.log("request.body", request.body);
    });
    // router.get("/acronym_tag_map", async (request, response, next) => {
    //     const pgClient = await db.pool.connect();

    //     const result = await pgClient.query("SELECT * FROM fuqua_acronym_tag_map");
    //     pgClient.release();
    //     response.json(result.rows);
    // });
} catch(err) {
    return result.send("There was an error", err);
}

module.exports = router;