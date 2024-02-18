
const express = require("express");
const router = express.Router();
const db = require("../db/postgres");

try {
    router.get("/user", async (request, response) => {
        if (request.identity === undefined  ||  request.identity.dukeid === undefined) {
            response.status(401).json({error: "No identity for this person"});           
        } else {
            try {
                const pgClient = await db.pool.connect();
                const result = await pgClient.query(getUserQueryConfig(request.identity.dukeid));
                pgClient.release();
                //console.log("result! /user/" + id, result.rows);
                response.status(200).json(result.rows);
            } catch(_err) {
                console.log("psql error:", _err);
                response.status(500).json({err: _err, errorMsg: "Internal database error on the nodejs side"});
            }
        }
    });   
} catch(err) {
   response.status(500).json({err: err, error: "Internal error on the nodejs side"});
}


// GET ACRONYM BY ID
try {
    router.get("/acronym/:id", async (request, response) => {
        const id = request.params.id;
        console.log(id);

        const queryConfig = {
            text: "SELECT * FROM fuqua_acronyms WHERE id = $1 AND active IS TRUE ",
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

// GET ALL ACRONYMS
try {
    router.get("/acronyms", async (request, response, next) => {
       // console.log(request.rawHeaders);
       try {
            const pgClient = await db.pool.connect();

            const result = await pgClient.query("SELECT * FROM fuqua_acronyms WHERE active is TRUE ORDER BY acronym");
            pgClient.release();
            response.json(result.rows);
       } catch(_err) {
            console.log("psql error:", _err);
            response.status(500).json({err: _err, errorMsg: "Internal database error on the nodejs side"});      
        }
    });
} catch(err) {
    response.status(500).json({err: err, error: "Internal error on the nodejs side"});
}

// POST NEW ACRONYM
try {
    router.post("/new_acronym", async (request, response) => {

        if (request.identity === undefined  ||  request.identity.dukeid === undefined) {
            response.status(401).json({error: "No identity for this person"});           
        } else {
            const data = request.body;


            const pgClient = await db.pool.connect();

            try {
                await pgClient.query("BEGIN");

                const result = await pgClient.query(getUserQueryConfig(request.identity.dukeid));
                console.log("RESULT", result.rows); // if admin, array length 1; if not admin, empty

                if (result.rows === undefined  ||  result.rows === null  ||  result.rows.length === 0) {
                    response.status(401).json({error: "No admin privilege", identity: request.identity});        
                } else {
                    if (data["id"] !== null) {
                        const sqlUpdate = "UPDATE fuqua_acronyms SET active = false WHERE id = ($1) RETURNING id";
                        const updateResult = await pgClient.query(sqlUpdate, [data["id"]]);
                        console.log(`UPDATE fuqua_acronyms SET active = false WHERE id = ${data["id"]} RETURNING id`);
                    }

                    const tagString = data["tagString"].replace(/,*$/, ""); // remove any trailing commas from the tag string
                    const values = [data["acronym"], data["refersTo"], data["definition"], data["areaKey"], tagString, true, "postgres" ];
                    const sqlInsert = `INSERT INTO fuqua_acronyms(acronym, refers_to, definition, area_key, tag_string, active, created_by) 
                                         VALUES($1,$2,$3,$4,$5,$6,$7)   RETURNING * `;
                    console.log(`INSERT INTO fuqua_acronyms(acronym, refers_to, definition, area_key, tag_string, active, created_by) 
                                    VALUES(${data["acronym"]},${data["refersTo"]},${data["definition"]},${data["areaKey"]},${tagString}, true, postgres)   
                                    RETURNING * `);

                    const result1 = await pgClient.query(sqlInsert, values);
                    const acronymId = result1["rows"][0].id;
                    console.log("new acronymId", acronymId);

                    await pgClient.query("COMMIT");
                    response.json(result1);
                }
            } catch(e) {
                console.log("Postgres ", e);
                await pgClient.query("ROLLBACK");
                response.json({"error": e});
            } finally {
                pgClient.release();
            }
        }
     });
} catch(err) {
    return result.send("There was an error", err);
} 

// DELETE ACRONYM
try {
    router.delete("/delete_acronym/:id", async (request, response) => {

        const id = request.params.id;
        //console.log(id);

        const pgClient = await db.pool.connect();

        try {
            await pgClient.query("BEGIN");

            const sql = "DELETE FROM fuqua_acronyms WHERE id = $1 RETURNING *";
            console.log(`DELETE FROM fuqua_acronyms WHERE id = ${id} RETURNING *`);
            const result1 = await pgClient.query(sql, [id]);

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

getUserQueryConfig = (id) => {
    const queryConfig = {
        text: "SELECT * FROM fuqua_acronym_permissions WHERE duke_id = $1 AND active IS TRUE ",
        values: [id]
    };
    console.log(`SELECT * FROM fuqua_acronym_permissions WHERE duke_id = ${id} AND active IS TRUE`);
    return queryConfig;
}

module.exports = router;