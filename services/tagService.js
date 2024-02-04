// http://localhost:3050/api/acronym_tags

const express = require("express");
const router = express.Router();
const db = require("../db/postgres");

function getTags() {
    console.log("getTags");
    try {
        router.get("/tags", async (request, response, next) => {
            const pgClient = await db.pool.connect();

            result = await pgClient.query("SELECT name FROM fuqua_acronym_tags WHERE active IS TRUE ");
            pgClient.release();
            console.log("result", result);
            return response.json(result.rows);
        });
    } catch(err) {
        console.log("Error fetching tag data");
        return [];
        //return result.send("There was an error", err);
    }
}

module.exports = { router, getTags };