const config = require("../config/config");
const pg = require("pg");

const client = new pg.Client({
    user: config.data.postgres.user,
    host: config.data.postgres.host,
    database: config.data.postgres.database,
    password: config.data.postgres.password,
    port: config.data.postgres.port
});

const pool = new pg.Pool({
    user: config.data.postgres.user,
    host: config.data.postgres.host,
    database: config.data.postgres.database,
    password: config.data.postgres.password,
    port: config.data.postgres.port
});

module.exports = { client, pool };
