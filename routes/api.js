
const express = require("express");
const router = express.Router();
const db = require("../db/postgres");
const logger = require("../logging/logger");

try {
    router.get("/user", async (request, response) => {
        if (request.identity === undefined  ||  request.identity.dukeid === undefined) {
            logger.logIt(__filename, `GET /user  No identity object in request body - returning 401`, "error");
            response.status(401).json({error: "No identity for this person"});           
        } else {
            logger.logIt(__filename, `GET /user  dukeid=${request.identity.dukeid}`)
            try {
                const pgClient = await db.pool.connect();
                const result = await pgClient.query(getUserQueryConfig(request.identity.dukeid));
                pgClient.release();
                if (result.rows.length === 0) {
                    logger.logIt(__filename, `${request.identity.dukeid} is not found in fuqua_acronym_permissions table - no admin privilege granted`);
                } else {
                    logger.logIt(__filename, `${request.identity.dukeid} is found in fuqua_acronym_permissions table - admin privilege granted`);
                }
                response.status(200).json(result.rows);
            } catch(_err) {
                logger.logIt(__filename,`${_err}`, "error");
                response.status(500).json({err: _err, errorMsg: "Internal database error on the nodejs side"});
            }
        }
    });   
} catch(err) {
    logger.logIt(__filename,`GET /user 500 ${err} `, "error");
    response.status(500).json({err: err, error: "/user Internal error on the nodejs side"});
}


// GET ACRONYM BY ID
try {
    router.get("/acronym/:id", async (request, response) => {
        const id = request.params.id;
        logger.logIt(__filename, `GET /acronym/${id}`);

        const valid = validate(request);
        if (!valid) {
            logger.logIt(__filename, `GET /acronym/${id} 401 Cannot identify user`, "error");
            response.status(401).json({errorMsg: " Cannot identify user"});
        } else {
            const queryConfig = {
                text: "SELECT * FROM fuqua_acronyms WHERE id = $1 AND active IS TRUE ",
                values: [id]
            };

            const pgClient = await db.pool.connect();
            const result = await pgClient.query(queryConfig);
            pgClient.release();
            response.status(200).json(result.rows);
        }
    });   
} catch(err) {
    logger.logIt(__filename, `GET /acronym/${id} 500 ${err} `, "error");
    response.status(500).json({err: err, error: "/acronym:id Internal error on the nodejs side"});
}

// GET ALL ACRONYMS
try {
    router.get("/acronyms", async (request, response, next) => {
        logger.logIt(__filename, `GET /acronyms  `);
        const valid = validate(request);
        if (!valid) {
            logger.logIt(__filename, "Get /acronyms 401 Cannot identify user", "error");
            response.status(401).json({errorMsg: " Cannot identify user"});
        } else {
            try {
                const pgClient = await db.pool.connect();

                const result = await pgClient.query("SELECT * FROM fuqua_acronyms WHERE active is TRUE ORDER BY acronym");
                pgClient.release();
                response.status(200).json(result.rows);
            } catch(_err) {
                logger.logIt(__filename, `GET /acronyms 500 ${_err} `, "error");
                response.status(500).json({err: _err, errorMsg: "Internal database error on the nodejs side"});      
            }
        }
    });
} catch(err) {
    logger.logIt(__filename, `GET /acronyms 500 ${err} `, "error");
    response.status(500).json({err: err, error: "/acronyms Internal error on the nodejs side"});
}

// POST NEW ACRONYM
try {
    router.post("/new_acronym", async (request, response) => {
        const valid = validate(request);
        if (!valid) {
            logger.logIt(__filename, "POST /new_acronym 401 Cannot identify user", "error");
            response.status(401).json({errorMsg: " Cannot identify user"});
        } else {
            logger.logIt(__filename, `POST /new_acronym  dukeid=${request.identity.dukeid}`)
            const data = request.body;

            const pgClient = await db.pool.connect();

            try {
                await pgClient.query("BEGIN");

                const result = await pgClient.query(getUserQueryConfig(request.identity.dukeid));
                //console.log("RESULT", result.rows); // if admin, array length 1; if not admin, empty

                if (result.rows === undefined  ||  result.rows === null  ||  result.rows.length === 0) {
                    logger.logIt(__filename, `POST /new_acronym  dukeid=${request.identity.dukeid}  No admin privilege, POST denied`, "error")
                    response.status(401).json({error: "No admin privilege", identity: request.identity});        
                } else {
                    if (data["id"] !== null) {
                        const sqlUpdate = "UPDATE fuqua_acronyms SET active = false WHERE id = ($1) RETURNING id";
                        const updateResult = await pgClient.query(sqlUpdate, [data["id"]]);
                        logger.logIt(__filename, `admin privilege confirmed: UPDATE fuqua_acronyms SET active = false WHERE id = ${data["id"]} RETURNING id`);
                    }

                    const tagString = data["tagString"].replace(/,*$/, ""); // remove any trailing commas from the tag string
                    const values = [data["acronym"], data["refersTo"], data["definition"], data["areaKey"], tagString, true, "postgres" ];
                    const sqlInsert = `INSERT INTO fuqua_acronyms(acronym, refers_to, definition, area_key, tag_string, active, created_by) 
                                         VALUES($1,$2,$3,$4,$5,$6,$7)   RETURNING * `;
                    logger.logIt(__filename, `admin privilege confirmed: INSERT INTO fuqua_acronyms(acronym, refers_to, definition, area_key, tag_string, active, created_by) 
                                    VALUES(${data["acronym"]},${data["refersTo"]},${data["definition"]},${data["areaKey"]},${tagString}, true, postgres)   
                                    RETURNING * `);

                    const result1 = await pgClient.query(sqlInsert, values);
                    const acronymId = result1["rows"][0].id;
                    logger.logIt(__filename, `new acronymId=${acronymId}`);

                    await pgClient.query("COMMIT");
                    response.status(200).json(result1);
                }
            } catch(e) {
                logger.logIt(__filename, `POST /new_acronym 500 ${_e} `, "error");
                await pgClient.query("ROLLBACK");
                response.status(500).json({"error": e});
            } finally {
                pgClient.release();
            }
        }
     });
} catch(err) {
    logger.logIt(__filename, `POST /new_acronym 500 ${err} `, "error");
    response.status(500).json({err: err, error: "/new_acronym, Internal error on the nodejs side"});
} 

// DELETE ACRONYM
try {
    router.delete("/delete_acronym/:id", async (request, response) => {
        const valid = validate(request);
        if (!valid) {
            logger.logIt(__filename, "DELETE /delete_acronym 401 Cannot identify user", "error");
            response.status(401).json({errorMsg: " Cannot identify user"});
        } else {
            const id = request.params.id;

            const pgClient = await db.pool.connect();

            try {
                await pgClient.query("BEGIN");

                const result = await pgClient.query(getUserQueryConfig(request.identity.dukeid));

                if (result.rows === undefined  ||  result.rows === null  ||  result.rows.length === 0) {
                    logger.logIt(__filename, `DELETE /acronym  No admin privilege for dukeid=${id} - returning 401`, "error");
                    response.status(401).json({error: "No admin privilege", identity: request.identity});        
                } else {
                    const sql = "DELETE FROM fuqua_acronyms WHERE id = $1 RETURNING *";
                    logger.logIt(__filename, `admin privilege confirmed: DELETE FROM fuqua_acronyms WHERE id = ${id} RETURNING *`);
                    const result1 = await pgClient.query(sql, [id]);

                    await pgClient.query("COMMIT");
                    response.status(200).json(result1);
                }
            } catch(e) {
                await pgClient.query("ROLLBACK");
                logger.logIt(__filename, `DELETE /acronyms 500 ${e} `, "error");
                response.status(500).json({"error": e});
            } finally {
                pgClient.release();
            }
        }
    });
} catch(err) {
    logger.logIt(__filename, `DELETE /acronym 500 ${err} `, "error");
    response.status(500).json({err: err, error: "/delete_acronym, Internal error on the nodejs side"});
} 

getUserQueryConfig = (id) => {
    const queryConfig = {
        text: "SELECT * FROM fuqua_acronym_permissions WHERE duke_id = $1 AND active IS TRUE ",
        values: [id]
    };
   // console.log(`SELECT * FROM fuqua_acronym_permissions WHERE duke_id = ${id} AND active IS TRUE`);
    return queryConfig;
}

validate = (request) => {
    if (request.identity === undefined  ||  request.identity.dukeid === undefined) {
        //logger.logIt(__filename, `GET /user  No identity object in request body - returning 401`, "error");
        return false;
       // response.status(401).json({error: "No identity for this person"});           
    } 
    return true;
}

module.exports = router;