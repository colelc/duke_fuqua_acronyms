
const express = require("express");
const router = express.Router();
const db = require("../db/postgres");

// Define route for get all acronyms
// http://localhost:3050/acronyms
// router.get("/", (request, response) => {
//     response.send("This is the get all acronyms route");
// });



// Define route for get a specific acronym by id
// http://localhost:3050/acronym/71
try {
    router.get("/acronym/:id", async (request, response) => {
        const id = request.params.id;
        console.log(id);

        const queryConfig = {
            text: "SELECT * FROM fuqua_acronyms WHERE id = $1",
            values: [id]
        };

        const pgClient = await db.pool.connect();
        const result = await pgClient.query(queryConfig);
        pgClient.release();
        console.log("result! /acronym/:id", result.rows[0]);
        //response.send(result.rows);
        response.status(200).json(result.rows);
    });   
} catch(err) {
    return result.send("There was an error");
}

// Define route for get a tag map for a specific acronym
// http://localhost:3050/api/acronym_tag_map/2
try {
    router.get("/acronym_tag_map/:id", async (request, response) => {
        const id = request.params.id;

        const queryConfig = {
            text: "SELECT * FROM fuqua_acronym_tag_map WHERE acronym_id = $1",
            values: [id]
        };

        const pgClient = await db.pool.connect();
        const result = await pgClient.query(queryConfig);
        pgClient.release();
        console.log("result! /api/acronym_tag_map/:id", result.rows[0]);
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

        const result = await pgClient.query("SELECT * FROM fuqua_acronyms WHERE active is TRUE ORDER BY acronym");
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

        const result = await pgClient.query("SELECT * FROM fuqua_acronym_tags WHERE active IS TRUE");
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
    router.post("/new_acronym", async (request, response) => {
        //console.log("request.body", request.body);

        const data = request.body;
        console.log("data", data);

        // remove any trailing commas from the tag string
        const tagString = data["tagString"].replace(/,*$/, "");
        const values1 = [data["acronym"], data["refersTo"], data["definition"], data["areaKey"], tagString, true, "postgres" ];
        const sql1 = `INSERT INTO fuqua_acronyms(acronym, refers_to, definition, area_key, tag_string, active, created_by) 
                    VALUES($1,$2,$3,$4,$5,$6,$7)   RETURNING * `;
        
        const pgClient = await db.pool.connect();

        try {
            await pgClient.query("BEGIN");

            if (data["id"] !== null) {
                const sql0 = "DELETE FROM fuqua_acronym_tag_map WHERE acronym_id = ($1)";
                console.log(sql0);
                console.log(data["id"]);
                const result0 = await pgClient.query(sql0, [data["id"]]);
                console.log("result0", result0);

                const sql1 = "UPDATE fuqua_acronyms SET active = false WHERE id = ($1) RETURNING id";
                const result1 = await pgClient.query(sql1, [data["id"]]);
                console.log("result1", result1);
            }

            console.log(sql1);
            console.log(values1.join(", "));
            const result1 = await pgClient.query(sql1, values1);
            console.log(result1["rows"][0]);
            const acronymId = result1["rows"][0].id;
            console.log("acronymId", acronymId);

            // if we have new tags, need to insert them into fuqua_acronym_tags
            console.log("data[tags", data["tags"]);
            if (data["tags"].length > 0) {  
                const sql2 = `INSERT INTO fuqua_acronym_tags (name, created_by) VALUES($1, $2) RETURNING *`;
                console.log(sql2);
                for (let newTag of data["tags"]) {
                    console.log(newTag);
                    const result2 = await pgClient.query(sql2, [newTag, "postgres"]);
                    console.log(result2["rows"][0]);
                    const tagId = result2["rows"][0]["id"];
                    console.log("tagId", tagId);

                    const sql3 = `INSERT INTO fuqua_acronym_tag_map (acronym_id, tag_id, created_by)
                                    VALUES($1, $2, $3) RETURNING *`;
                    const values = [acronymId, tagId, "postgres"];
                    console.log(sql3);
                    console.log(values);
                    const result3 = await pgClient.query(sql3, values);
                    console.log(result3["rows"][0].id);
                }
            } // if have tags to add

            await pgClient.query("COMMIT");
            response.json(result1);
        } catch(e) {
            console.log("Postgres ", e);
            await pgClient.query("ROLLBACK");
            response.json({"error": e});
        } finally {
            pgClient.release();
        }

     });
} catch(err) {
    return result.send("There was an error", err);
} 

// EDIT ACRONYM
try {
    router.put("/edit_acronym", async (request, response) => {
        //console.log("request.body", request.body);

        const data = request.body;

        // remove any trailing commas from the tag string
        const tagString = data["tagString"].replace(/,*$/, "");
        const values1 = [data["id"], data["acronym"], data["refersTo"], data["definition"], data["areaKey"], tagString, "postgres" ];
        const sql1 = `UPDATE fuqua_acronyms 
                        SET acronym = ($2), 
                        refers_to = ($3), 
                        definition = ($4), 
                        area_key = ($5), 
                        tag_string = ($6), 
                        last_updated_by = ($7),
                        last_updated = NOW() 
                      WHERE id = ($1)
                      RETURNING * `;
        
        const pgClient = await db.pool.connect();

        try {
            await pgClient.query("BEGIN");

            console.log(sql1);
            console.log(values1.join(", "));
            const result1 = await pgClient.query(sql1, values1);
            console.log(result1["rows"][0]);
            const acronymId = result1["rows"][0].id;
            console.log("acronymId", acronymId);

            // if we have new tags, need to insert them into fuqua_acronym_tags
            // console.log("data[tags", data["tags"]);
            // if (data["tags"].length > 0) {  
            //     const sql2 = `INSERT INTO fuqua_acronym_tags (name, created_by) VALUES($1, $2) RETURNING *`;
            //     console.log(sql2);
            //     for (let newTag of data["tags"]) {
            //         console.log(newTag);
            //         const result2 = await pgClient.query(sql2, [newTag, "postgres"]);
            //         console.log(result2["rows"][0]);
            //         const tagId = result2["rows"][0]["id"];
            //         console.log("tagId", tagId);

            //         const sql3 = `INSERT INTO fuqua_acronym_tag_map (acronym_id, tag_id, created_by)
            //                         VALUES($1, $2, $3) RETURNING *`;
            //         const values = [acronymId, tagId, "postgres"];
            //         console.log(sql3);
            //         console.log(values);
            //         const result3 = await pgClient.query(sql3, values);
            //         console.log(result3["rows"][0].id);
            //     }
            // } // if have tags to add

            await pgClient.query("COMMIT");
            response.json(result1);
        } catch(e) {
            console.log("Postgres ", e);
            await pgClient.query("ROLLBACK");
            response.json({"error": e});
        } finally {
            pgClient.release();
        }

     });
} catch(err) {
    return result.send("There was an error", err);
} 

module.exports = router;