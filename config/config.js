const dotenv = require("dotenv");

dotenv.config();

const ENV = (process.env.ENV).toLowerCase().trim();
console.log("ENV is " + ENV);

const data = {
    apiPort: ENV === "d" ? process.env.D_REST_API_PORT : process.env.P_REST_API_PORT,
    postgres: {
        host: ENV === "d" ? process.env.D_POSTGRES_HOST : process.env.P_POSTGRES_HOST,
        database: ENV === "d" ? process.env.D_POSTGRES_DATABASE : process.env.P_POSTGRES_DATABASE,
        user: ENV === "d" ? process.env.D_POSTGRES_USER : process.env.P_POSTGRES_USER,
        password: ENV === "d" ? process.env.D_POSTGRES_PASSWORD : process.env.P_POSTGRES_PASSWORD,
        port: ENV === "d" ? process.env.D_POSTGRES_PORT : process.env.P_POSTGRES_PORT
    }
};

module.exports = { data }