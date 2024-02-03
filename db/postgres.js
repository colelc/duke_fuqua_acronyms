const config = require("../config/config");
const pg = require("pg");

// const client = new pg.Client({
//     user: config.data.postgres.user,
//     host: config.data.postgres.host,
//     database: config.data.postgres.database,
//     password: config.data.postgres.password,
//     port: config.data.postgres.port
// });

const pool = new pg.Pool({
    user: config.data.postgres.user,
    host: config.data.postgres.host,
    database: config.data.postgres.database,
    password: config.data.postgres.password,
    port: config.data.postgres.port
});

// the pool will emit an error on behalf of any idle clients
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
   

//module.exports = { client, pool };
module.exports = { pool };
